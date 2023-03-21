
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