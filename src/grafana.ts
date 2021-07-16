import { Construct } from 'constructs';
import { Grafana } from './imports/grafana';
import { GrafanaDashboard } from './imports/grafana-dashboard';
import { GrafanaDataSource } from './imports/grafana-datasource';
import { LabelSelector } from './imports/k8s';

export interface GrafanaServiceProps {
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
   * Labels to apply to all Grafana resources.
   * @default - { app: "grafana" }
   */
  readonly labels?: { [name: string]: string };
}

export class GrafanaService extends Construct {
  public readonly dataSources: DataSource[];
  public readonly dashboards: Dashboard[];
  public readonly labels: { [name: string]: string };

  constructor(scope: Construct, id: string, props: GrafanaServiceProps = {}) {
    super(scope, id);

    const baseImage = props.image ?? 'public.ecr.aws/ubuntu/grafana:latest';
    const ingress = props.ingress ?? true;
    const adminUser = props.adminUser ?? 'root';
    const adminPassword = props.adminPassword ?? 'secret';
    const requireLogin = props.requireLogin ?? false;
    this.labels = props.labels ?? { app: 'grafana' };
    const dashboardLabelSelectors: LabelSelector[] = [{ matchLabels: this.labels ?? { app: 'grafana' } }];


    const grafana = new Grafana(this, id, {
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

    for (const [key, value] of Object.entries(this.labels)) {
      grafana.metadata.addLabel(key, value);
    }

    this.dataSources = [];
    this.dashboards = [];
  }

  /**
   * Creates a data source. By default, labels are automatically applied so that
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
  public addDashboard(id: string, dataSource: DataSource, props: DashboardProps): Dashboard {
    const labels = {
      ...this.labels,
      ...props.labels,
    };
    const dashboard = new Dashboard(this, id, dataSource, { labels, ...props });
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
  constructor(scope: Construct, id: string, dataSource: DataSource, props: DashboardProps) {
    super(scope, id);

    const defaults = {
      id: null,
      tags: [],
      style: 'dark',
      timezone: 'browser',
      editable: true,
      hideControls: false,
      graphTooltip: 1,
      panels: [],
      time: {
        from: 'now-6h',
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
      refresh: '5s',
      schemaVersion: 17,
      version: 0,
      links: [],
    } as any;

    const dashboard = new GrafanaDashboard(this, id, {
      spec: {
        customFolderName: props.folder,
        datasources: [{
          datasourceName: dataSource.name,
          inputName: dataSource.variable,
        }],
        json: JSON.stringify({
          ...defaults,
          ...props.jsonModel,
          title: props.title,
        }, null, 2),
        name: id,
      },
    });

    for (const [key, value] of Object.entries(props.labels ?? {})) {
      dashboard.metadata.addLabel(key, value);
    }
  }
}
