module "userdb" {
  source  = "../../modules/database"

  name           = "sqldb-user-${var.env}"
  server_id      = azurerm_mssql_server.sqlserver.id
  tags = local.tags
}
