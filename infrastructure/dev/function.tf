resource "azurerm_storage_account" "func_storage" {
  name                     = "stsomeroc${var.env}"
  resource_group_name      = azurerm_resource_group.dev.name
  location                 = azurerm_resource_group.dev.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  shared_access_key_enabled = true

#   network_rules {
#     default_action             = "Deny"
#     bypass                     = ["Logging","Metrics","AzureServices"]
#     virtual_network_subnet_ids = [data.azurerm_subnet.subnet.id]
#   }

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}

resource "azurerm_service_plan" "consumption" {
  name                = "apps-${var.env}"
  resource_group_name = azurerm_resource_group.dev.name
  location            = azurerm_resource_group.dev.location
  os_type             = "Linux"
  sku_name            = "Y1"

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}

resource "azurerm_linux_function_app" "example" {
  name                = "func-${var.workload_name}-${var.env}"
  resource_group_name = azurerm_resource_group.dev.name
  location            = azurerm_resource_group.dev.location

  storage_account_name       = azurerm_storage_account.func_storage.name
  storage_account_access_key = azurerm_storage_account.func_storage.primary_access_key
  service_plan_id            = azurerm_service_plan.consumption.id

  site_config {}

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}