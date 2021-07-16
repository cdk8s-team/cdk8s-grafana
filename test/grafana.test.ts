import { Chart, Testing } from 'cdk8s';
import { GrafanaService } from '../src';

describe('a grafana instance', () => {
  test('defaults', () => {
    // GIVEN
    const app = Testing.app();
    const chart = new Chart(app, 'test');

    // WHEN
    new GrafanaService(chart, 'my-grafana');

    // THEN
    expect(Testing.synth(chart)).toMatchSnapshot();
  });
});