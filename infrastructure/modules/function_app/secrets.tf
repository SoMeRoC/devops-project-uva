
data "azurerm_key_vault" "kv" {
    name = "kv-${var.workload_name}-shared-${var.env}"
    resource_group_name = data.azurerm_resource_group.shared.name
}

data "azurerm_resource_group" "shared" {
    name = "rg-${var.workload_name}-shared-${var.env}"
}

data "azurerm_key_vault_secret" "gameApi" {
  name         = "gameApi"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "sessionApi" {
  name         = "sessionApi"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "userApi" {
  name         = "userApi"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "matchApi" {
  name         = "matchApi"
  key_vault_id = data.azurerm_key_vault.kv.id
}