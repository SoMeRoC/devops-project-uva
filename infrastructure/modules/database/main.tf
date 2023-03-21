resource "azurerm_mssql_database" "db" {
  name           = "${var.name}"
  server_id      = var.server_id
  collation      = "SQL_Latin1_General_CP1_CI_AS"

  auto_pause_delay_in_minutes = 1440
  max_size_gb    = 4
  read_scale     = false
  sku_name = "GP_S_Gen5_1"
  min_capacity = 0.5

  zone_redundant = true
  tags = var.tags

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}