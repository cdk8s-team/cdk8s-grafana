# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Dashboard <a name="cdk8s-grafana.Dashboard"></a>

A Grafana dashboard.

> https://grafana.com/docs/grafana/latest/http_api/dashboard/

#### Initializers <a name="cdk8s-grafana.Dashboard.Initializer"></a>

```typescript
import { Dashboard } from 'cdk8s-grafana'

new Dashboard(scope: Construct, id: string, props: DashboardProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.props"></a>

- *Type:* [`cdk8s-grafana.DashboardProps`](#cdk8s-grafana.DashboardProps)

---

#### Methods <a name="Methods"></a>

##### `addPlugins` <a name="cdk8s-grafana.Dashboard.addPlugins"></a>

```typescript
public addPlugins(plugins: GrafanaPlugin)
```

###### `plugins`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.plugins"></a>

- *Type:* [`cdk8s-grafana.GrafanaPlugin`](#cdk8s-grafana.GrafanaPlugin)

---




### DataSource <a name="cdk8s-grafana.DataSource"></a>

A Grafana data source.

> https://grafana.com/docs/grafana/latest/administration/provisioning/#example-data-source-config-file

#### Initializers <a name="cdk8s-grafana.DataSource.Initializer"></a>

```typescript
import { DataSource } from 'cdk8s-grafana'

new DataSource(scope: Construct, id: string, props: DataSourceProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-grafana.DataSource.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-grafana.DataSource.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk8s-grafana.DataSource.parameter.props"></a>

- *Type:* [`cdk8s-grafana.DataSourceProps`](#cdk8s-grafana.DataSourceProps)

---



#### Properties <a name="Properties"></a>

##### `name`<sup>Required</sup> <a name="cdk8s-grafana.DataSource.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

Name of the data source.

---


### Grafana <a name="cdk8s-grafana.Grafana"></a>

A Grafana instance.

#### Initializers <a name="cdk8s-grafana.Grafana.Initializer"></a>

```typescript
import { Grafana } from 'cdk8s-grafana'

new Grafana(scope: Construct, id: string, props?: GrafanaProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-grafana.Grafana.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-grafana.Grafana.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-grafana.Grafana.parameter.props"></a>

- *Type:* [`cdk8s-grafana.GrafanaProps`](#cdk8s-grafana.GrafanaProps)

---

#### Methods <a name="Methods"></a>

##### `addDashboard` <a name="cdk8s-grafana.Grafana.addDashboard"></a>

```typescript
public addDashboard(id: string, props: DashboardProps)
```

###### `id`<sup>Required</sup> <a name="cdk8s-grafana.Grafana.parameter.id"></a>

- *Type:* `string`

---

###### `props`<sup>Required</sup> <a name="cdk8s-grafana.Grafana.parameter.props"></a>

- *Type:* [`cdk8s-grafana.DashboardProps`](#cdk8s-grafana.DashboardProps)

---

##### `addDataSource` <a name="cdk8s-grafana.Grafana.addDataSource"></a>

```typescript
public addDataSource(id: string, props: DataSourceProps)
```

###### `id`<sup>Required</sup> <a name="cdk8s-grafana.Grafana.parameter.id"></a>

- *Type:* `string`

---

###### `props`<sup>Required</sup> <a name="cdk8s-grafana.Grafana.parameter.props"></a>

- *Type:* [`cdk8s-grafana.DataSourceProps`](#cdk8s-grafana.DataSourceProps)

---




## Structs <a name="Structs"></a>

### DashboardProps <a name="cdk8s-grafana.DashboardProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { DashboardProps } from 'cdk8s-grafana'

const dashboardProps: DashboardProps = { ... }
```

##### `title`<sup>Required</sup> <a name="cdk8s-grafana.DashboardProps.property.title"></a>

```typescript
public readonly title: string;
```

- *Type:* `string`

Title of the dashboard.

---

##### `dataSourceVariables`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.dataSourceVariables"></a>

```typescript
public readonly dataSourceVariables: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}
- *Default:* no data source variables

Specify a mapping from data source variables to data source names.

This is only needed if you are importing an existing dashboard's JSON
and it specifies variables within an "__inputs" field.

---

##### `folder`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.folder"></a>

```typescript
public readonly folder: string;
```

- *Type:* `string`
- *Default:* default folder

Group dashboards into folders.

---

##### `jsonModel`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.jsonModel"></a>

```typescript
public readonly jsonModel: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: `any`}

All other dashboard customizations.

> https://grafana.com/docs/grafana/latest/dashboards/json-model/

---

##### `labels`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.labels"></a>

```typescript
public readonly labels: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}
- *Default:* no labels

Labels to apply to the kubernetes resource.

When adding a dashboard to a Grafana instance using `grafana.addDashboard`,
labels provided to Grafana will be automatically applied. Otherwise,
labels must be added manually.

---

##### `namespace`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.namespace"></a>

```typescript
public readonly namespace: string;
```

- *Type:* `string`
- *Default:* undefined (will be assigned to the 'default' namespace)

Namespace to apply to the kubernetes resource.

When adding a dashboard to a Grafana instance using `grafana.addDashboard`,
the namespace will be automatically inherited.

---

##### `plugins`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.plugins"></a>

```typescript
public readonly plugins: GrafanaPlugin[];
```

- *Type:* [`cdk8s-grafana.GrafanaPlugin`](#cdk8s-grafana.GrafanaPlugin)[]

Specify plugins required by the dashboard.

---

##### `refreshRate`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.refreshRate"></a>

```typescript
public readonly refreshRate: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* 5 seconds

Auto-refresh interval.

---

##### `timeRange`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.timeRange"></a>

```typescript
public readonly timeRange: Duration;
```

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* 6 hours

Time range for the dashboard, e.g. last 6 hours, last 7 days, etc.

---

### DataSourceProps <a name="cdk8s-grafana.DataSourceProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { DataSourceProps } from 'cdk8s-grafana'

const dataSourceProps: DataSourceProps = { ... }
```

##### `access`<sup>Required</sup> <a name="cdk8s-grafana.DataSourceProps.property.access"></a>

```typescript
public readonly access: AccessType;
```

- *Type:* [`cdk8s-grafana.AccessType`](#cdk8s-grafana.AccessType)

Access type of the data source.

---

##### `name`<sup>Required</sup> <a name="cdk8s-grafana.DataSourceProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

Name of the data source.

---

##### `type`<sup>Required</sup> <a name="cdk8s-grafana.DataSourceProps.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* `string`

Type of the data source.

---

##### `description`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* `string`
- *Default:* no description

Description of the data source.

---

##### `labels`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.labels"></a>

```typescript
public readonly labels: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}
- *Default:* no labels

Labels to apply to the kubernetes resource.

When adding a data source to a Grafana instance using `grafana.addDataSource`,
labels provided to Grafana will be automatically applied. Otherwise,
labels must be added manually.

---

##### `namespace`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.namespace"></a>

```typescript
public readonly namespace: string;
```

- *Type:* `string`
- *Default:* undefined (will be assigned to the 'default' namespace)

Namespace to apply to the kubernetes resource.

When adding a data source to a Grafana instance using `grafana.addDataSource`,
the namespace will be automatically inherited.

---

##### `url`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.url"></a>

```typescript
public readonly url: string;
```

- *Type:* `string`
- *Default:* default url for data source type

URL of the data source.

Most resources besides the 'testdata' data source
type require this field in order to retrieve data.

---

### GrafanaPlugin <a name="cdk8s-grafana.GrafanaPlugin"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GrafanaPlugin } from 'cdk8s-grafana'

const grafanaPlugin: GrafanaPlugin = { ... }
```

##### `name`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaPlugin.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* `string`

Name of the plugin, e.g. "grafana-piechart-panel".

---

##### `version`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaPlugin.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* `string`

Version of the plugin, e.g. "1.3.6".

---

### GrafanaProps <a name="cdk8s-grafana.GrafanaProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GrafanaProps } from 'cdk8s-grafana'

const grafanaProps: GrafanaProps = { ... }
```

##### `adminPassword`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.adminPassword"></a>

```typescript
public readonly adminPassword: string;
```

- *Type:* `string`
- *Default:* "secret"

Default admin password.

---

##### `adminUser`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.adminUser"></a>

```typescript
public readonly adminUser: string;
```

- *Type:* `string`
- *Default:* "root"

Default admin username.

---

##### `defaultDataSource`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.defaultDataSource"></a>

```typescript
public readonly defaultDataSource: DataSourceProps;
```

- *Type:* [`cdk8s-grafana.DataSourceProps`](#cdk8s-grafana.DataSourceProps)
- *Default:* no data source added

Default data source - equivalent to calling `grafana.addDataSource`.

---

##### `image`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* `string`
- *Default:* "public.ecr.aws/ubuntu/grafana:latest"

Specify a custom image for Grafana.

---

##### `ingress`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.ingress"></a>

```typescript
public readonly ingress: boolean;
```

- *Type:* `boolean`
- *Default:* true

Create an ingress to provide external access to the Grafana cluster.

---

##### `labels`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.labels"></a>

```typescript
public readonly labels: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}
- *Default:* { app: "grafana" }

Labels to apply to all Grafana resources.

---

##### `namespace`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.namespace"></a>

```typescript
public readonly namespace: string;
```

- *Type:* `string`
- *Default:* undefined (will be assigned to the 'default' namespace)

Namespace to apply to all Grafana resources.

The Grafana Operator must be
installed in this namespace for resources to be recognized.

---

##### `requireLogin`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.requireLogin"></a>

```typescript
public readonly requireLogin: boolean;
```

- *Type:* `boolean`
- *Default:* false

Require login in order to view or manage dashboards.

---

##### `serviceType`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.serviceType"></a>

```typescript
public readonly serviceType: string;
```

- *Type:* `string`
- *Default:* ClusterIP

Type of service to be created (NodePort, ClusterIP or LoadBalancer).

---



## Enums <a name="Enums"></a>

### AccessType <a name="AccessType"></a>

Mode for accessing a data source.

> https://grafana.com/docs/grafana/latest/administration/provisioning/#example-data-source-config-file

#### `PROXY` <a name="cdk8s-grafana.AccessType.PROXY"></a>

Access via proxy.

---


#### `DIRECT` <a name="cdk8s-grafana.AccessType.DIRECT"></a>

Access directly (via server or browser in UI).

---

