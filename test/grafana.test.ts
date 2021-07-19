import { Chart, Duration, Testing } from 'cdk8s';
import { Grafana } from '../src';

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

const PANELS = [
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
        access: 'proxy',
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
      },
    });

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
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
    expect(manifest).toMatchSnapshot();
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
    expect(manifest).toMatchSnapshot();
    expect(manifest[1].spec.plugins).toMatchObject(PLUGINS);
  });

  test('adding panels via constructor', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana');
    grafana.addDashboard('my-dashboard', {
      title: 'My Dashboard',
      panels: PANELS,
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[1].spec.json).toContain('Panel Title');
  });

  test('adding panels via method', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana');
    const dashboard = grafana.addDashboard('my-dashboard', { title: 'My Dashboard' });
    dashboard.addPanels(...PANELS);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[1].spec.json).toContain('Panel Title');
  });
});
