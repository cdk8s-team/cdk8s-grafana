import { Duration } from 'cdk8s';
import { Construct } from 'constructs';
import { GrafanaDashboard } from './imports/grafana-dashboard';

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
   * This is only needed if you are importing an existing dashboard's JSON
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
   * @default - 6 hours
   */
  readonly timeRange?: Duration;

  /**
   * Specify plugins required by the dashboard.
   */
  readonly plugins?: GrafanaPlugin[];

  /**
   * Labels to apply to the kubernetes resource.
   *
   * When adding a dashboard to a Grafana instance using `grafana.addDashboard`,
   * labels provided to Grafana will be automatically applied. Otherwise,
   * labels must be added manually.
   *
   * @default - no labels
   */
  readonly labels?: { [name: string]: string };

  /**
   * Namespace to apply to the kubernetes resource.
   *
   * When adding a dashboard to a Grafana instance using `grafana.addDashboard`,
   * the namespace will be automatically inherited.
   *
   * @default - undefined (will be assigned to the 'default' namespace)
   */
  readonly namespace?: string;

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
  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id);

    this.plugins = [];

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
      panels: [],
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

    new GrafanaDashboard(this, 'Resource', {
      metadata: {
        labels: props.labels,
        namespace: props.namespace,
      },
      spec: {
        customFolderName: props.folder,
        datasources: dataSources,
        plugins: this.plugins,
        json: JSON.stringify({
          ...defaults,
          ...props.jsonModel,
        }, null, 2),
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
