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
});