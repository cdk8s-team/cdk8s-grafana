## cdk8s-grafana

cdk8s-grafana is a library that lets you easily define a Grafana service for
your kubernetes cluster along with associated dashboards and datasources, using
a high level API.

Under the hood, the [Grafana
Operator](https://operatorhub.io/operator/grafana-operator) is used to manage
custom resources based on user-provided options. To achieve this, the resources
needed for [Operator Lifecycle
Manager](https://github.com/operator-framework/operator-lifecycle-manager/releases)
v0.18.2 and Grafana Operator v3.10.2 come pre-bundled and will be included with
the synthesized YAML's. The `bundleOperator: false` flag can be provided to omit
the Grafana operator resources during synthesis, allowing an existing
installation of the operator to be used (see
https://operatorhub.io/operator/grafana-operator for more information).

### Usage

The following will define a Grafana cluster with a dashboard and Prometheus
datasource (note: metrics will be empty unless a corresponding Prometheus
instance is set up):

```typescript
import { GrafanaService } from 'cdk8s-grafana';

// inside your chart:
const service = new GrafanaService(this, 'my-grafana');
const prometheus = service.addDatasource('my-datasource', {
  name: 'Prometheus',
  type: 'prometheus',
  access: 'proxy',
  url: 'http://prometheus-service:9090',
});
const dashboard = service.addDashboard('my-dashboard', { 
  datasource: prometheus,
  title: 'My Dashboard',
});
```

Basic aspects of a dashboard can be customized:

```typescript
const dashboard = service.addDashboard('my-dashboard', { 
  datasource: prometheus,
  refresh: '10s',
  timeRange: Duration.hours(6), // show metrics from now-6h to now
  hideControls: true
});
dashboard.addPlugin({
  name: 'grafana-piechart-panel',
  version: '1.3.6',
})
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more
information.

## License

This project is licensed under the Apache-2.0 License.

