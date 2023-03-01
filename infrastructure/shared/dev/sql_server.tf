resource "random_password" "db_root" {
  length           = 16
  special          = true
}

resource "azurerm_mssql_server" "sqlserver" {
  name                         = "sql-${var.workload_name}-shared-${var.env}"

  resource_group_name          = azurerm_resource_group.shared.name
  location                     = azurerm_resource_group.shared.location
  version                      = "12.0"
  administrator_login          = "someroc_admin"
  administrator_login_password = random_password.db_root.result
  minimum_tls_version          = "1.2"

  tags = local.tags

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}