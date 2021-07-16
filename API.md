# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Dashboard <a name="cdk8s-grafana.Dashboard"></a>

A Grafana dashboard.

> https://grafana.com/docs/grafana/latest/http_api/dashboard/

#### Initializer <a name="cdk8s-grafana.Dashboard.Initializer"></a>

```typescript
import { Dashboard } from 'cdk8s-grafana'

new Dashboard(scope: Construct, id: string, dataSource: DataSource, props: DashboardProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.id"></a>

- *Type:* `string`

---

##### `dataSource`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.dataSource"></a>

- *Type:* [`cdk8s-grafana.DataSource`](#cdk8s-grafana.DataSource)

---

##### `props`<sup>Required</sup> <a name="cdk8s-grafana.Dashboard.parameter.props"></a>

- *Type:* [`cdk8s-grafana.DashboardProps`](#cdk8s-grafana.DashboardProps)

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


### GrafanaService <a name="cdk8s-grafana.GrafanaService"></a>

#### Initializer <a name="cdk8s-grafana.GrafanaService.Initializer"></a>

```typescript
import { GrafanaService } from 'cdk8s-grafana'

new GrafanaService(scope: Construct, id: string, props?: GrafanaServiceProps)
```

##### `scope`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaService.parameter.props"></a>

- *Type:* [`cdk8s-grafana.GrafanaServiceProps`](#cdk8s-grafana.GrafanaServiceProps)

---

#### Methods <a name="Methods"></a>

##### `addDashboard` <a name="cdk8s-grafana.GrafanaService.addDashboard"></a>

```typescript
public addDashboard(id: string, dataSource: DataSource, props: DashboardProps)
```

###### `id`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.parameter.id"></a>

- *Type:* `string`

---

###### `dataSource`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.parameter.dataSource"></a>

- *Type:* [`cdk8s-grafana.DataSource`](#cdk8s-grafana.DataSource)

---

###### `props`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.parameter.props"></a>

- *Type:* [`cdk8s-grafana.DashboardProps`](#cdk8s-grafana.DashboardProps)

---

##### `addDataSource` <a name="cdk8s-grafana.GrafanaService.addDataSource"></a>

```typescript
public addDataSource(id: string, props: DataSourceProps)
```

###### `id`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.parameter.id"></a>

- *Type:* `string`

---

###### `props`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.parameter.props"></a>

- *Type:* [`cdk8s-grafana.DataSourceProps`](#cdk8s-grafana.DataSourceProps)

---


#### Properties <a name="Properties"></a>

##### `dashboards`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.property.dashboards"></a>

- *Type:* [`cdk8s-grafana.Dashboard`](#cdk8s-grafana.Dashboard)[]

---

##### `dataSources`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.property.dataSources"></a>

- *Type:* [`cdk8s-grafana.DataSource`](#cdk8s-grafana.DataSource)[]

---

##### `labels`<sup>Required</sup> <a name="cdk8s-grafana.GrafanaService.property.labels"></a>

- *Type:* {[ key: string ]: `string`}

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

### GrafanaServiceProps <a name="cdk8s-grafana.GrafanaServiceProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { GrafanaServiceProps } from 'cdk8s-grafana'

const grafanaServiceProps: GrafanaServiceProps = { ... }
```

##### `adminPassword`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaServiceProps.property.adminPassword"></a>

- *Type:* `string`
- *Default:* "secret"

Default admin password.

---

##### `adminUser`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaServiceProps.property.adminUser"></a>

- *Type:* `string`
- *Default:* "root"

Default admin username.

---

##### `image`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaServiceProps.property.image"></a>

- *Type:* `string`
- *Default:* "public.ecr.aws/ubuntu/grafana:latest"

Specify a custom image for Grafana.

---

##### `ingress`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaServiceProps.property.ingress"></a>

- *Type:* `boolean`
- *Default:* true

Create an ingress to provide external access to the Grafana cluster.

---

##### `labels`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaServiceProps.property.labels"></a>

- *Type:* {[ key: string ]: `string`}
- *Default:* { app: "grafana" }

Labels to apply to all Grafana resources.

---

##### `requireLogin`<sup>Optional</sup> <a name="cdk8s-grafana.GrafanaServiceProps.property.requireLogin"></a>

- *Type:* `boolean`
- *Default:* false

Require login in order to view or manage dashboards.

---



