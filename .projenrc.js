const { Cdk8sTeamJsiiProject } = require('@cdk8s/projen-common');

const project = new Cdk8sTeamJsiiProject({
  name: 'cdk8s-grafana',
  description: 'Grafana construct for cdk8s.',
  keywords: [
    'kubernetes',
    'grafana',
    'cdk8s',
    'dashboards',
    'observability',
  ],
  defaultReleaseBranch: 'main',
  peerDeps: [
    'cdk8s',
    'constructs',
  ],
  devDeps: [
    '@cdk8s/projen-common',
  ],
});

project.synth();