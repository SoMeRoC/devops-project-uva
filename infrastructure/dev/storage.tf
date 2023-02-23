resource "azurerm_storage_account" "func_storage" {
  name                     = "st${var.workload_name}${var.env}"
  resource_group_name      = azurerm_resource_group.dev.name
  location                 = azurerm_resource_group.dev.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  shared_access_key_enabled = true

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}