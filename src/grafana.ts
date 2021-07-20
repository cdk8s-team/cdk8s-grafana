import { Duration, Lazy } from 'cdk8s';
import { Construct } from 'constructs';
import { Grafana as RawGrafana } from './imports/grafana';
import { GrafanaDashboard } from './imports/grafana-dashboard';
import { GrafanaDataSource } from './imports/grafana-datasource';
import { LabelSelector } from './imports/k8s';

export interface GrafanaProps {
  /**
   * Specify a custom image for Grafana.
   * @default "public.ecr.aws/ubuntu/grafana:latest"
   */
  readonly image?: string;

  /**
   * Create an ingress to provide external access to the Grafana cluster.
   * @default true
   */
  readonly ingress?: boolean;

  /**
   * Default admin username.
   * @default "root"
   */
  readonly adminUser?: string;

  /**
   * Default admin password.
   * @default "secret"
   */
  readonly adminPassword?: string;

  /**
   * Require login in order to view or manage dashboards.
   * @default false
   */
  readonly requireLogin?: boolean;

  /**
   * Default data source - the default data source added to any newly created
   * dashboards.
   * @default - no data source added
   */
  readonly defaultDataSource?: DataSourceProps;

  /**
   * Labels to apply to all Grafana resources.
   * @default - { app: "grafana" }
   */
  readonly labels?: { [name: string]: string };
}

/**
 * A Grafana cluster.
 */
export class Grafana extends Construct {
  private readonly dataSources: DataSource[];
  private readonly dashboards: Dashboard[];
  private readonly labels: { [name: string]: string };

  constructor(scope: Construct, id: string, props: GrafanaProps = {}) {
    super(scope, id);

    const baseImage = props.image ?? 'public.ecr.aws/ubuntu/grafana:latest';
    const ingress = props.ingress ?? true;
    const adminUser = props.adminUser ?? 'root';
    const adminPassword = props.adminPassword ?? 'secret';
    const requireLogin = props.requireLogin ?? false;
    this.labels = props.labels ?? { app: 'grafana' };
    const dashboardLabelSelectors: LabelSelector[] = [{ matchLabels: this.labels ?? { app: 'grafana' } }];

    new RawGrafana(this, id, {
      metadata: {
        labels: this.labels,
      },
      spec: {
        baseImage: baseImage,
        ingress: {
          enabled: ingress,
        },
        client: {
          // without this, dashboards may not be automatically discovered
          // https://github.com/grafana-operator/grafana-operator/blob/master/documentation/deploy_grafana.md#configuring-grafana-api-access
          preferService: true,
        },
        config: {
          'log': {
            mode: 'console',
            level: 'debug',
          },
          'auth.anonymous': {
            enabled: !requireLogin,
          },
          'security': {
            admin_user: adminUser,
            admin_password: adminPassword,
          },
        },
        deployment: {
          labels: this.labels,
        },
        dashboardLabelSelector: dashboardLabelSelectors,
      },
    });

    this.dataSources = [];
    this.dashboards = [];

    if (props.defaultDataSource) {
      this.addDataSource('default-datasource', props.defaultDataSource);
    }
  }

  /**
   * Adds a data source. By default, labels are automatically added so that
   * the data source is detected by Grafana.
   */
  public addDataSource(id: string, props: DataSourceProps): DataSource {
    const labels = {
      ...this.labels,
      ...props.labels,
    };
    const datasource = new DataSource(this, id, { labels, ...props });
    this.dataSources.push(datasource);
    return datasource;
  }

  /**
   * Creates a dashboard associated with a particular data source.
   */
  public addDashboard(id: string, props: DashboardProps): Dashboard {
    const labels = {
      ...this.labels,
      ...props.labels,
    };
    // connect with first datasource by default (unless overridden by props)
    const dataSources = this.dataSources.slice(0, 1);

    const dashboard = new Dashboard(this, id, { labels, dataSources, ...props });
    this.dashboards.push(dashboard);
    return dashboard;
  }
}

export interface DataSourceProps {
  /**
   * Name of the data source.
   */
  readonly name: string;

  /**
   * Description of the data source.
   * @default undefined
   */
  readonly description?: string;

  /**
   * Type of the data source.
   */
  readonly type?: string;

  /**
   * URL of the data source.
   */
  readonly url?: string;

  /**
   * Access type of the data source.
   */
  readonly access?: string;

  /**
   * Labels to apply to the kubernetes resource.
   * @default - labels re-applied from `GrafanaService`
   */
  readonly labels?: { [name: string]: string };
}

/**
 * A Grafana data source.
 * @see https://grafana.com/docs/grafana/latest/http_api/data_source/
 */
export class DataSource extends Construct {
  /**
   * Name of the data source.
   */
  public readonly name: string;

  /**
   * Name of datasource variable used to pass information to dashboards.
   * @see https://github.com/grafana-operator/grafana-operator/blob/master/documentation/dashboards.md#datasource-inputs
   */
  public readonly variable: string;

  constructor(scope: Construct, id: string, props: DataSourceProps) {
    super(scope, id);

    new GrafanaDataSource(this, id, {
      metadata: {
        labels: props.labels,
      },
      spec: {
        name: props.name,
        datasources: [{
          name: props.name,
          type: props.type,
          access: props.access,
          url: props.url,
        }],
      },
    });

    this.name = props.name;
    this.variable = `DS_${props.name.toLocaleUpperCase()}`;
  }
}

export interface DashboardProps {
  /**
   * Title of the dashboard.
   */
  readonly title: string;

  /**
   * Group dashboards into folders.
   * @default - default folder
   */
  readonly folder?: string;

  /**
   * Datasources to connect to the dashboard.
   * @default - the default data source is added (if it exists)
   */
  readonly dataSources?: DataSource[];

  /**
   * Auto-refresh interval.
   * @default - 5 seconds
   */
  readonly refreshRate?: Duration;

  /**
   * Time range for the dashboard, e.g. last 6 hours, last 7 days, etc.
   * @default - '6h'
   */
  readonly timeRange?: Duration;

  /**
   * Specify panels in the dashboard.
   * @see https://grafana.com/docs/grafana/latest/dashboards/json-model/#panels
   */
  readonly panels?: any[];

  /**
   * Specify plugins required by the dashboard.
   */
  readonly plugins?: GrafanaPlugin[];

  /**
   * Labels to apply to the kubernetes resource.
   * @default - labels re-applied from `GrafanaService`
   */
  readonly labels?: { [name: string]: string };

  /**
   * All other dashboard customizations.
   * @see https://grafana.com/docs/grafana/latest/dashboards/json-model/
   */
  readonly jsonModel?: { [key: string]: any };
}

/**
 * A Grafana dashboard.
 * @see https://grafana.com/docs/grafana/latest/http_api/dashboard/
 */
export class Dashboard extends Construct {
  private readonly plugins: GrafanaPlugin[];
  private readonly panels: any[];
  private panelId: number;
  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id);

    const refreshRate = props.refreshRate ?? Duration.seconds(5);
    const timeRange = props.timeRange ?? Duration.hours(6);
    const dataSources = props.dataSources?.map((ds) => ({
      datasourceName: ds.name,
      inputName: ds.variable,
    }));

    this.plugins = [];
    this.panels = [];
    this.panelId = 0;

    const defaults = {
      title: props.title,
      id: null,
      tags: [],
      style: 'dark',
      timezone: 'browser',
      editable: true,
      hideControls: false,
      graphTooltip: 1,
      panels: this.panels,
      time: {
        from: `now-${timeRange.toSeconds()}s`,
        to: 'now',
      },
      timepicker: {
        time_options: [],
        refresh_intervals: [],
      },
      templating: {
        list: [],
      },
      annotations: {
        list: [],
      },
      refresh: `${refreshRate.toSeconds()}s`,
      schemaVersion: 17,
      version: 0,
      links: [],
    } as any;

    new GrafanaDashboard(this, id, {
      metadata: {
        labels: props.labels,
      },
      spec: {
        customFolderName: props.folder,
        datasources: dataSources,
        plugins: this.plugins,

        // dashboard contents are expected as a raw JSON string
        // needs to be generated lazily since this.panels may change
        json: Lazy.any({
          produce: () => {
            return JSON.stringify({
              ...defaults,
              ...props.jsonModel,
            }, null, 2);
          },
        }),
        name: id,
      },
    });

    if (props.plugins) {
      this.addPlugins(...props.plugins);
    }

    if (props.panels) {
      this.addPanels(...props.panels);
    }
  }

  /**
   * Adds one or more plugins.
   */
  public addPlugins(...plugins: GrafanaPlugin[]) {
    for (const plugin of plugins) {
      this.plugins.push(plugin);
    }
  }

  /**
   * Adds one or more panels.
   */
  public addPanels(...panels: any[]) {
    for (const panel of panels) {
      this.panels.push({
        id: this.panelId++,
        ...panel,
      });
    }
  }
}

export interface GrafanaPlugin {
  /**
   * Name of the plugin, e.g. "grafana-piechart-panel"
   */
  readonly name: string;

  /**
   * Version of the plugin, e.g. "1.3.6"
   */
  readonly version: string;
}
