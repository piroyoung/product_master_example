targetScope = 'resourceGroup'

param searchServiceName string
param principalId string

resource searchService 'Microsoft.Search/searchServices@2025-05-01' existing = {
  name: searchServiceName
}

var searchRoles = [
  {
    name: 'search-service-contributor'
    roleDefinitionId: '7ca78c08-252a-4471-8644-bb5ff32d4ba0'
  }
  {
    name: 'search-index-data-contributor'
    roleDefinitionId: '8ebe5a00-799e-43f5-93ac-243d3dce84a7'
  }
]

resource searchRoleAssignments 'Microsoft.Authorization/roleAssignments@2022-04-01' = [
  for role in searchRoles: {
    name: guid(searchService.id, principalId, role.roleDefinitionId)
    scope: searchService
    properties: {
      roleDefinitionId: subscriptionResourceId(
        'Microsoft.Authorization/roleDefinitions',
        role.roleDefinitionId
      )
      principalId: principalId
      principalType: 'ServicePrincipal'
    }
  }
]
