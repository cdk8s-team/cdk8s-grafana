const { Cdk8sTeamJsiiProject } = require('@cdk8s/projen-common');
const { javascript } = require('projen');

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
  golang: false,

  peerDeps: [
    'cdk8s',
    'constructs',
  ],

  devDeps: [
    '@cdk8s/projen-common',
  ],

  depsUpgradeOptions: {
    workflowOptions: {
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 0 * * *']),
    },
  },
});

project.synth();