
resource "azurerm_key_vault_secret" "db_pass" {
  depends_on = [
    azurerm_role_assignment.spn_to_kv
  ]
  name         = "dbroot"
  value        = random_password.db_root.result
  key_vault_id = azurerm_key_vault.kv.id
}

resource "azurerm_key_vault_secret" "db_connection_string_game" {
  depends_on = [
    azurerm_role_assignment.spn_to_kv
  ]

  name         = "gameConnection"
  value        = format("Server=tcp:sql-someroc-shared-dev.database.windows.net,1433;Initial Catalog=sqldb-game-dev;Persist Security Info=False;User ID=someroc_admin;Password=%s;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",random_password.db_root.result)
  key_vault_id = azurerm_key_vault.kv.id
}
