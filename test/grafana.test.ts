import { Chart, Duration, Testing } from 'cdk8s';
import { AccessType, Grafana } from '../src';

const PLUGINS = [
  {
    name: 'grafana-piechart-panel',
    version: '1.3.6',
  },
  {
    name: 'grafana-clock-panel',
    version: '1.0.2',
  },
];

describe('a grafana instance', () => {
  test('defaults', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new Grafana(chart, 'my-grafana');

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('Nodeport and no ingress', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new Grafana(chart, 'my-grafana', {
      ingress: false,
      serviceType: 'NodePort',
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[0].spec.ingress.enabled).toEqual(false);
    expect(manifest[0].spec.service.type).toEqual('NodePort');
  });

  test('with customized auth', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new Grafana(chart, 'my-grafana', {
      adminUser: 'admin',
      adminPassword: 'this-is-a-bad-password',
      requireLogin: true,
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[0].spec.config['auth.anonymous'].enabled).toEqual(false);
    expect(manifest[0].spec.config.security.admin_user).toEqual('admin');
    expect(manifest[0].spec.config.security.admin_password).toEqual('this-is-a-bad-password');
  });

  test('with data source and customized dashboard', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana', {
      defaultDataSource: {
        name: 'Prometheus',
        type: 'prometheus',
        access: AccessType.PROXY,
        url: 'http://prometheus-service:9090',
      },
    });
    grafana.addDashboard('my-dashboard', {
      title: 'My Dashboard',
      folder: 'special-dashboards',
      refreshRate: Duration.seconds(10),
      timeRange: Duration.hours(6),
      jsonModel: {
        hideControls: true,
        panels: [
          {
            type: 'text',
            title: 'Panel Title',
            gridPos: {
              x: 0,
              y: 0,
              w: 12,
              h: 9,
            },
            mode: 'markdown',
            content: '# title',
          },
        ],
      },
    });

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });

  test('with a dashboard expecting a data source variable', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana');
    const prometheus = grafana.addDataSource('prometheus', {
      name: 'Prometheus',
      type: 'prometheus',
      access: AccessType.PROXY,
      url: 'http://prometheus-service:9090',
    });
    grafana.addDashboard('my-dashboard', {
      title: 'My Dashboard',
      folder: 'special-dashboards',
      refreshRate: Duration.seconds(10),
      timeRange: Duration.hours(6),
      jsonModel: {
        __inputs: [
          {
            name: 'DS_PROMETHEUS',
            label: 'Prometheus',
            description: '',
            type: 'datasource',
            pluginId: 'prometheus',
            pluginName: 'Prometheus',
          },
        ],
      },
      dataSourceVariables: {
        DS_PROMETHEUS: prometheus.name,
      },
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[2].spec.datasources.length).toEqual(1);
  });

  test('labels are inherited by dashboards and data sources', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana', {
      labels: { stage: 'prod' },
    });
    grafana.addDashboard('my-dashboard', {
      title: 'My Dashboard',
    });
    grafana.addDataSource('prometheus', {
      name: 'Prometheus',
      type: 'prometheus',
      access: AccessType.PROXY,
      url: 'http://prometheus-service:9090',
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[0].metadata.labels.stage).toEqual('prod'); // grafana instance
    expect(manifest[1].metadata.labels.stage).toEqual('prod'); // dashboard instance
    expect(manifest[2].metadata.labels.stage).toEqual('prod'); // data source instance
  });

  test('namespaces are inherited by dashboards and data sources', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana', {
      namespace: 'my-namespace',
    });
    grafana.addDashboard('my-dashboard', {
      title: 'My Dashboard',
    });
    grafana.addDataSource('prometheus', {
      name: 'Prometheus',
      type: 'prometheus',
      access: AccessType.PROXY,
      url: 'http://prometheus-service:9090',
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[0].metadata.namespace).toEqual('my-namespace'); // grafana instance
    expect(manifest[1].metadata.namespace).toEqual('my-namespace'); // dashboard instance
    expect(manifest[2].metadata.namespace).toEqual('my-namespace'); // data source instance
  });

  test('adding plugins via constructor', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana');
    grafana.addDashboard('my-dashboard', {
      title: 'My Dashboard',
      plugins: PLUGINS,
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[1].spec.plugins).toMatchObject(PLUGINS);
  });

  test('adding plugins via method', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana');
    const dashboard = grafana.addDashboard('my-dashboard', { title: 'My Dashboard' });
    dashboard.addPlugins(...PLUGINS);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest[1].spec.plugins).toMatchObject(PLUGINS);
  });
});
