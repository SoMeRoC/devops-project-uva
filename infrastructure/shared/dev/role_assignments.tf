resource "azurerm_role_assignment" "spn_to_kv" {
  scope                            = data.azurerm_key_vault.kv.id
  role_definition_name             = "Key Vault Secrets Officer"
  principal_id                     = data.azurerm_client_config.current.object_id
}