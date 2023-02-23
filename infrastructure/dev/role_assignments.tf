resource "azurerm_role_assignment" "agw_to_kv" {
  scope                            = data.azurerm_key_vault.kv.id
  role_definition_name             = "Key Vault Secrets Officer"
  principal_id                     = module.user_management.principal_id
}
