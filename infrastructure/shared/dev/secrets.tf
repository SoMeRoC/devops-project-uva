
resource "azurerm_key_vault_secret" "db_pass" {
  name         = "dbroot"
  value        = random_password.db_root.result
  key_vault_id = azurerm_key_vault.kv.id
}