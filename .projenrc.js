const { Component } = require('projen');
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

// Run the build job on the CNCF hosted runner.
project.github.tryFindWorkflow('build').file.addOverride('jobs.build.runs-on', 'cncf-c-ubuntu-26.04-8-32-x86');

// In every workflow job: pin node 24 and install yarn v1 right after node is set up.
// Implemented as a component so it runs after all workflows/jobs are registered.
// (@cdk8s/projen-common does not allow the `workflowNodeVersion` option.)
const NODE_VERSION = '24';
const YARN_STEP = { name: 'Install yarn v1', run: 'npm install -g yarn@1' };

function addYarnStep(steps, nodeFromTools) {
  const result = nodeFromTools ? [YARN_STEP] : [];
  for (const step of steps) {
    result.push(step);
    if (step.uses && step.uses.startsWith('actions/setup-node@')) {
      result[result.length - 1] = { ...step, with: { ...step.with, 'node-version': NODE_VERSION } };
      result.push(YARN_STEP);
    }
  }
  return result;
}

class NodeSetup extends Component {
  preSynthesize() {
    for (const workflow of this.project.github.workflows) {
      for (const job of Object.values(workflow.jobs)) {
        if (!job.steps) continue;
        // some jobs render their steps lazily, so wrap rather than mutate.
        const original = job.steps;
        // jobs declaring `tools.node` get their setup-node step prepended at render time.
        const nodeFromTools = Boolean(job.tools && job.tools.node);
        if (nodeFromTools) {
          job.tools = { ...job.tools, node: { ...job.tools.node, version: NODE_VERSION } };
        }
        job.steps = () => addYarnStep(typeof original === 'function' ? original() : original, nodeFromTools);
      }
    }
  }
}
new NodeSetup(project);

project.synth();