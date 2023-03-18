
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
  value        = format("Server=tcp:sql-someroc-shared-dev.database.windows.net,1433;Initial Catalog='sqldb-game-dev';Persist Security Info=False;User ID='someroc_admin';Password='%s';MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",random_password.db_root.result)
  key_vault_id = azurerm_key_vault.kv.id
}

resource "azurerm_key_vault_secret" "db_connection_string_user" {
  depends_on = [
    azurerm_role_assignment.spn_to_kv
  ]

  name         = "userConnection"
  value        = format("Server=tcp:sql-someroc-shared-dev.database.windows.net,1433;Initial Catalog='sqldb-user-dev';Persist Security Info=False;User ID='someroc_admin';Password='%s';MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",random_password.db_root.result)
  key_vault_id = azurerm_key_vault.kv.id
}


resource "azurerm_key_vault_secret" "db_connection_string_session" {
  depends_on = [
    azurerm_role_assignment.spn_to_kv
  ]

  name         = "sessionConnection"
  value        = format("Server=tcp:sql-someroc-shared-dev.database.windows.net,1433;Initial Catalog='sqldb-session-dev';Persist Security Info=False;User ID='someroc_admin';Password='%s';MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",random_password.db_root.result)
  key_vault_id = azurerm_key_vault.kv.id
}

resource "azurerm_key_vault_secret" "app_conf_connection_string" {
  depends_on = [
    azurerm_role_assignment.spn_to_kv
  ]

  name         = "appConfig"
  value        = azurerm_app_configuration.appconf.primary_read_key[0].connection_string
  key_vault_id = azurerm_key_vault.kv.id
}
