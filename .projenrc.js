const { ConstructLibraryCdk8s } = require('projen');
const project = new ConstructLibraryCdk8s({
  author: 'Christopher Rybicki',
  authorAddress: 'rybickic@amazon.com',
  cdk8sVersion: '1.0.0-beta.10',
  defaultReleaseBranch: 'main',
  name: 'cdk8s-grafana',
  repositoryUrl: 'https://github.com/cdk8s-team/cdk8s-grafana.git',
  constructsVersion: '3.3.48',

  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});
project.synth();