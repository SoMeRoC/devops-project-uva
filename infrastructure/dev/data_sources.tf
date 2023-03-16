data "azurerm_log_analytics_workspace" "la" {
  name                = "log-platform-prd-weu-001"
  resource_group_name = "rg-platform-management-prd-weu-001"
}

data "azurerm_resource_group" "shared" {
    name = "rg-${var.workload_name}-shared-${var.env}"
}

data "azurerm_key_vault" "kv" {
    name = "kv-${var.workload_name}-shared-${var.env}"
    resource_group_name = data.azurerm_resource_group.shared.name
}

data "azurerm_key_vault_secret" "appconf" {
  name         = "appConfig"
  key_vault_id = data.azurerm_key_vault.kv.id
}
