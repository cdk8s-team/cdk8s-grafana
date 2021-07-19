# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Dashboard <a name="cdk8s-grafana.Dashboard"></a>

A Grafana dashboard.

> https://grafana.com/docs/grafana/latest/http_api/dashboard/

#### Initializer <a name="cdk8s-grafana.Dashboard.Initializer"></a>

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

##### `addPanels` <a name="cdk8s-grafana.Dashboard.addPanels"></a>

```typescript
public addPanels(panels: any)
```

###### `panels`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.panels"></a>

- *Type:* `any`

---

##### `addPlugins` <a name="cdk8s-grafana.Dashboard.addPlugins"></a>

```typescript
public addPlugins(plugins: GrafanaPlugin)
```

###### `plugins`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.plugins"></a>

- *Type:* [`cdk8s-grafana.GrafanaPlugin`](#cdk8s-grafana.GrafanaPlugin)

---




### DataSource <a name="cdk8s-grafana.DataSource"></a>

A Grafana data source.

> https://grafana.com/docs/grafana/latest/http_api/data_source/

#### Initializer <a name="cdk8s-grafana.DataSource.Initializer"></a>

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

- *Type:* `string`

Name of the data source.

---

##### `variable`<sup>Required</sup> <a name="cdk8s-grafana.DataSource.property.variable"></a>

- *Type:* `string`

Name of datasource variable used to pass information to dashboards.

> https://github.com/grafana-operator/grafana-operator/blob/master/documentation/dashboards.md#datasource-inputs

---


### Grafana <a name="cdk8s-grafana.Grafana"></a>

A Grafana cluster.

#### Initializer <a name="cdk8s-grafana.Grafana.Initializer"></a>

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

- *Type:* `string`

Title of the dashboard.

---

##### `dataSources`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.dataSources"></a>

- *Type:* [`cdk8s-grafana.DataSource`](#cdk8s-grafana.DataSource)[]
- *Default:* the default data source is added (if it exists)

Datasources to connect to the dashboard.

---

##### `folder`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.folder"></a>

- *Type:* `string`
- *Default:* default folder

Group dashboards into folders.

---

##### `jsonModel`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.jsonModel"></a>

- *Type:* {[ key: string ]: `any`}

All other dashboard customizations.

> https://grafana.com/docs/grafana/latest/dashboards/json-model/

---

##### `labels`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.labels"></a>

- *Type:* {[ key: string ]: `string`}
- *Default:* labels re-applied from `GrafanaService`

Labels to apply to the kubernetes resource.

---

##### `panels`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.panels"></a>

- *Type:* `any`[]

Specify panels in the dashboard.

> https://grafana.com/docs/grafana/latest/dashboards/json-model/#panels

---

##### `plugins`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.plugins"></a>

- *Type:* [`cdk8s-grafana.GrafanaPlugin`](#cdk8s-grafana.GrafanaPlugin)[]

Specify plugins required by the dashboard.

---

##### `refreshRate`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.refreshRate"></a>

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* 5 seconds

Auto-refresh interval.

---

##### `timeRange`<sup>Optional</sup> <a name="cdk8s-grafana.DashboardProps.property.timeRange"></a>

- *Type:* [`cdk8s.Duration`](#cdk8s.Duration)
- *Default:* '6h'

Time range for the dashboard, e.g. last 6 hours, last 7 days, etc.

---

### DataSourceProps <a name="cdk8s-grafana.DataSourceProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { DataSourceProps } from 'cdk8s-grafana'

const dataSourceProps: DataSourceProps = { ... }
```

##### `name`<sup>Required</sup> <a name="cdk8s-grafana.DataSourceProps.property.name"></a>

- *Type:* `string`

Name of the data source.

---

##### `access`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.access"></a>

- *Type:* `string`

Access type of the data source.

---

##### `description`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.description"></a>

- *Type:* `string`
- *Default:* undefined

Description of the data source.

---

##### `labels`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.labels"></a>

- *Type:* {[ key: string ]: `string`}
- *Default:* labels re-applied from `GrafanaService`

Labels to apply to the kubernetes resource.

---

##### `type`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.type"></a>

- *Type:* `string`

Type of the data source.

---

##### `url`<sup>Optional</sup> <a name="cdk8s-grafana.DataSourceProps.property.url"></a>

- *Type:* `string`

URL of the data source.

---

### GrafanaPlugin <a name="cdk8s-grafana.GrafanaPlugin"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GrafanaPlugin } from 'cdk8s-grafana'

const grafanaPlugin: GrafanaPlugin = { ... }
```

##### `name`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaPlugin.property.name"></a>

- *Type:* `string`

Name of the plugin, e.g. "grafana-piechart-panel".

---

##### `version`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaPlugin.property.version"></a>

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

- *Type:* `string`
- *Default:* "secret"

Default admin password.

---

##### `adminUser`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.adminUser"></a>

- *Type:* `string`
- *Default:* "root"

Default admin username.

---

##### `defaultDataSource`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.defaultDataSource"></a>

- *Type:* [`cdk8s-grafana.DataSourceProps`](#cdk8s-grafana.DataSourceProps)
- *Default:* no data source added

Default data source - the default data source added to any newly created dashboards.

---

##### `image`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.image"></a>

- *Type:* `string`
- *Default:* "public.ecr.aws/ubuntu/grafana:latest"

Specify a custom image for Grafana.

---

##### `ingress`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.ingress"></a>

- *Type:* `boolean`
- *Default:* true

Create an ingress to provide external access to the Grafana cluster.

---

##### `labels`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.labels"></a>

- *Type:* {[ key: string ]: `string`}
- *Default:* { app: "grafana" }

Labels to apply to all Grafana resources.

---

##### `requireLogin`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaProps.property.requireLogin"></a>

- *Type:* `boolean`
- *Default:* false

Require login in order to view or manage dashboards.

---



