import { Construct } from 'constructs';
import { Dashboard, DashboardProps } from './dashboard';
import { DataSource, DataSourceProps } from './datasource';
import { Grafana as RawGrafana } from './imports/grafana';
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

  /**
   * Namespace to apply to all Grafana resources. The Grafana Operator must be
   * installed in this namespace for the resources to be recognized.
   *
   * @default - undefined (will be assigned to the 'default' namespace)
   */
  readonly namespace?: string;
}

/**
 * A Grafana instance.
 */
export class Grafana extends Construct {
  private readonly dataSources: DataSource[];
  private readonly dashboards: Dashboard[];
  private readonly namespace: string | undefined;
  private readonly labels: { [name: string]: string };

  constructor(scope: Construct, id: string, props: GrafanaProps = {}) {
    super(scope, id);

    this.labels = props.labels ?? { app: 'grafana' };
    this.dataSources = [];
    this.dashboards = [];
    this.namespace = props.namespace;

    const baseImage = props.image ?? 'public.ecr.aws/ubuntu/grafana:latest';
    const ingress = props.ingress ?? true;
    const adminUser = props.adminUser ?? 'root';
    const adminPassword = props.adminPassword ?? 'secret';
    const requireLogin = props.requireLogin ?? false;
    const dashboardLabelSelectors: LabelSelector[] = [{ matchLabels: this.labels ?? { app: 'grafana' } }];

    new RawGrafana(this, 'Resource', {
      metadata: {
        labels: this.labels,
        namespace: this.namespace,
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
    const datasource = new DataSource(this, id, {
      labels,
      namespace: this.namespace,
      ...props,
    });
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
    const dashboard = new Dashboard(this, id, {
      labels,
      namespace: this.namespace,
      ...props,
    });
    this.dashboards.push(dashboard);
    return dashboard;
  }
}
