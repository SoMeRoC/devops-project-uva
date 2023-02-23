resource "azurerm_role_assignment" "func_users_to_kv" {
  scope                            = data.azurerm_key_vault.kv.id
  role_definition_name             = "Key Vault Secrets Officer"
  principal_id                     = module.user_management.principal_id
}

resource "azurerm_role_assignment" "webapp_to_kv" {
  scope                            = data.azurerm_key_vault.kv.id
  role_definition_name             = "Key Vault Secrets Officer"
  principal_id                     = azurerm_linux_web_app.fe.identity[0].principal_id
}

resource "azurerm_role_assignment" "webapp_cert_to_kv" {
  scope                            = data.azurerm_key_vault.kv.id
  role_definition_name             = "Key Vault Certificates Officer"
  principal_id                     = azurerm_linux_web_app.fe.identity[0].principal_id
}
