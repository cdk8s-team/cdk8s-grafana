const { JsiiProject } = require('projen');
const project = new JsiiProject({
  name: 'cdk8s-grafana',
  description: 'Grafana construct for cdk8s.',
  author: 'Amazon Web Services',
  authorUrl: 'https://aws.amazon.com',
  keywords: [
    'kubernetes',
    'grafana',
    'cdk8s',
    'dashboards',
    'observability',
  ],

  defaultReleaseBranch: 'main',
  repositoryUrl: 'https://github.com/cdk8s-team/cdk8s-grafana.git',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  peerDeps: [
    'cdk8s',
    'constructs',
  ],

  autoApproveOptions: {
    allowedUsernames: ['cdk8s-automation'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
});
project.synth();