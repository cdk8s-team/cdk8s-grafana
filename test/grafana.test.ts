import { Chart, Testing } from 'cdk8s';
import { Grafana } from '../src';

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

  test('adding plugins via constructor', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    const plugins = [
      {
        name: 'grafana-piechart-panel',
        version: '1.3.6',
      },
      {
        name: 'grafana-clock-panel',
        version: '1.0.2',
      },
    ];

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana');
    grafana.addDashboard('my-dashboard', {
      title: 'My Dashboard',
      plugins: plugins,
    });

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[1].spec.plugins).toMatchObject(plugins);
  });

  test('adding plugins via method', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    const plugins = [
      {
        name: 'grafana-piechart-panel',
        version: '1.3.6',
      },
      {
        name: 'grafana-clock-panel',
        version: '1.0.2',
      },
    ];

    // WHEN
    const grafana = new Grafana(chart, 'my-grafana');
    const dashboard = grafana.addDashboard('my-dashboard', { title: 'My Dashboard' });
    dashboard.addPlugins(...plugins);

    // THEN
    const manifest = Testing.synth(chart);
    expect(manifest).toMatchSnapshot();
    expect(manifest[1].spec.plugins).toMatchObject(plugins);
  });
});
