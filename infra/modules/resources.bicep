targetScope = 'resourceGroup'

param environmentName string
param location string = resourceGroup().location
param tags object = {}

var resourceSuffix = take(uniqueString(subscription().id, resourceGroup().name, environmentName), 6)
var compactEnvironmentName = toLower(replace(replace(environmentName, '-', ''), '_', ''))
var serviceName = 'web'
var searchIndexName = 'products'
var containerImageName = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

var containerRegistryName = take('acr${compactEnvironmentName}${resourceSuffix}', 50)
var logAnalyticsWorkspaceName = take('log-${environmentName}-${resourceSuffix}', 63)
var applicationInsightsName = take('appi-${environmentName}-${resourceSuffix}', 64)
var containerAppsEnvironmentName = take('cae-${environmentName}-${resourceSuffix}', 32)
var containerAppName = take('ca-${environmentName}-${resourceSuffix}', 32)
var searchServiceName = take('srch-${environmentName}-${resourceSuffix}', 60)
var serviceTags = union(tags, {
  'azd-service-name': serviceName
})

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: containerRegistryName
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

resource searchService 'Microsoft.Search/searchServices@2025-05-01' = {
  name: searchServiceName
  location: location
  tags: tags
  sku: {
    name: 'basic'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'Default'
    publicNetworkAccess: 'enabled'
    disableLocalAuth: true
  }
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvironmentName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  tags: serviceTags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        allowInsecure: false
        targetPort: 3000
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: serviceName
          image: containerImageName
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '3000'
            }
            {
              name: 'AZURE_SEARCH_ENDPOINT'
              value: 'https://${searchService.name}.search.windows.net'
            }
            {
              name: 'AZURE_SEARCH_INDEX_NAME'
              value: searchIndexName
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: applicationInsights.properties.ConnectionString
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

module acrPullRole './acr-pull-role.bicep' = {
  name: 'acr-pull-role'
  params: {
    acrName: containerRegistry.name
    principalId: containerApp.identity.principalId
  }
}

module searchRoles './search-roles.bicep' = {
  name: 'search-roles'
  params: {
    searchServiceName: searchService.name
    principalId: containerApp.identity.principalId
  }
}

output containerRegistryLoginServer string = containerRegistry.properties.loginServer
output searchEndpoint string = 'https://${searchService.name}.search.windows.net'
output webUrl string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
