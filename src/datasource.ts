import { Construct } from 'constructs';
import { GrafanaDataSource } from './imports/grafana-datasource';

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