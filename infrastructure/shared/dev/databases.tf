module "userdb" {
  source  = "../../modules/database"
  # Comment
  name           = "sqldb-user-${var.env}"
  server_id      = azurerm_mssql_server.sqlserver.id
  tags = local.tags
}

module "gamedb" {
  source  = "../../modules/database"

  name           = "sqldb-game-${var.env}"
  server_id      = azurerm_mssql_server.sqlserver.id
  tags = local.tags
}

module "sessiondb" {
  source  = "../../modules/database"

  name           = "sqldb-session-${var.env}"
  server_id      = azurerm_mssql_server.sqlserver.id
  tags = local.tags
}
