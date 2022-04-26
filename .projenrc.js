const { cdk } = require('projen');
const { Cdk8sCommon } = require('@cdk8s/projen-common');

const project = new cdk.JsiiProject({
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

  devDeps: [
    '@cdk8s/projen-common'
  ],

  publishToMaven: {
    javaPackage: 'org.cdk8s.grafana',
    mavenGroupId: 'org.cdk8s',
    mavenArtifactId: 'cdk8s-grafana',
  },

  publishToPypi: {
    distName: 'cdk8s-grafana',
    module: 'cdk8s_grafana',
  },

  publishToNuget: {
    dotNetNamespace: 'Org.Cdk8s.Grafana',
    packageId: 'Org.Cdk8s.Grafana',
  },

  autoApproveOptions: {
    allowedUsernames: ['cdk8s-automation'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,

  depsUpgradeOptions: {
    workflowOptions: {
      schedule: Cdk8sCommon.upgradeScheduleFor('cdk8s-grafana'),
    },
  },
});

new Cdk8sCommon(project);

project.synth();
