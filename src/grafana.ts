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
   * Default data source - equivalent to calling `addDataSource()`.
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
 * A Grafana instance.
 */
export class Grafana extends Construct {
  private readonly dataSources: DataSource[];
  private readonly dashboards: Dashboard[];
  private readonly labels: { [name: string]: string };

  constructor(scope: Construct, id: string, props: GrafanaProps = {}) {
    super(scope, id);

    this.labels = props.labels ?? { app: 'grafana' };
    this.dataSources = [];
    this.dashboards = [];

    const baseImage = props.image ?? 'public.ecr.aws/ubuntu/grafana:latest';
    const ingress = props.ingress ?? true;
    const adminUser = props.adminUser ?? 'root';
    const adminPassword = props.adminPassword ?? 'secret';
    const requireLogin = props.requireLogin ?? false;
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
            level: 'info',
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
   * Creates a dashboard associated with a particular data source. By default,
   * labels are automatically added so that the data source is detected by
   * Grafana.
   */
  public addDashboard(id: string, props: DashboardProps): Dashboard {
    const labels = {
      ...this.labels,
      ...props.labels,
    };
    const dashboard = new Dashboard(this, id, { labels, ...props });
    this.dashboards.push(dashboard);
    return dashboard;
  }
}

/**
 * Mode for accessing a data source.
 * @see https://grafana.com/docs/grafana/latest/administration/provisioning/#example-data-source-config-file
 */
export enum AccessType {
  /**
   * Access via proxy.
   */
  PROXY = 'proxy',

  /**
   * Access directly (via server or browser in UI).
   */
  DIRECT = 'direct',
}

export interface DataSourceProps {
  /**
   * Name of the data source.
   */
  readonly name: string;

  /**
   * Description of the data source.
   * @default - no description
   */
  readonly description?: string;

  /**
   * Type of the data source.
   */
  readonly type: string;

  /**
   * URL of the data source.
   * @default - no url
   */
  readonly url?: string;

  /**
   * Access type of the data source.
   */
  readonly access: AccessType;

  /**
   * Labels to apply to the kubernetes resource.
   *
   * When adding a data source to a Grafana instance through the addDatasource
   * method on Grafana, labels provided to Grafana will be automatically
   * applied. Otherwise, labels must be added manually.
   *
   * @default - no labels
   */
  readonly labels?: { [name: string]: string };
}

/**
 * A Grafana data source.
 * @see https://grafana.com/docs/grafana/latest/http_api/data_source/
 * @see https://grafana.com/docs/grafana/latest/administration/provisioning/#example-data-source-config-file
 */
export class DataSource extends Construct {
  /**
   * Name of the data source.
   */
  public readonly name: string;

  constructor(scope: Construct, id: string, props: DataSourceProps) {
    super(scope, id);

    this.name = props.name;

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
   * Specify a mapping from data source variables to data source names.
   * This is only needed you are importing an existing dashboard's JSON
   * and it specifies variables within an "__inputs" field.
   *
   * @example { DS_PROMETHEUS: "my-prometheus-ds" }
   * @default - no data source variables
   */
  readonly dataSourceVariables?: { [name: string]: string };

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
   * Specify plugins required by the dashboard.
   */
  readonly plugins?: GrafanaPlugin[];

  /**
   * Labels to apply to the kubernetes resource.
   *
   * When adding a dashboard to a Grafana instance through the addDashboard
   * method on Grafana, labels provided to Grafana will be automatically
   * applied. Otherwise, labels must be added manually.
   *
   * @default - no labels
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

    this.plugins = [];
    this.panels = [];
    this.panelId = 0;

    const refreshRate = props.refreshRate ?? Duration.seconds(5);
    const timeRange = props.timeRange ?? Duration.hours(6);
    const dataSources = Object.entries(props.dataSourceVariables ?? {}).map(
      ([variable, name]) => ({ datasourceName: name, inputName: variable }),
    );

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
