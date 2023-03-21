resource "azurerm_service_plan" "consumption" {
  name                = "apps-${var.workload_name}-${var.product_name}-${var.env}"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"

  tags = var.tags

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}

resource "azurerm_linux_function_app" "func" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location

  storage_account_name       = var.storage_account_name
  storage_account_access_key = var.storage_account_access_key
  service_plan_id            = azurerm_service_plan.consumption.id

  tags = var.tags

  app_settings = {
    "AZURE_APP_CONFIG_CONNECTION_STRING" = var.app_conf_connection_string
    "SqlConnectionString" =  var.sql_connection_string
    "gameApi" = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.gameApi.id})"
    "sessionApi" = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.sessionApi.id})"
    "userApi" = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.userApi.id})"
    "matchApi" = "@Microsoft.KeyVault(SecretUri=${data.azurerm_key_vault_secret.matchApi.id})"
  }

  connection_string {
    name = "SqlConnectionString"
    type = "SQLAzure"
    value = var.sql_connection_string
  }


  site_config {
    application_insights_connection_string = var.application_insights_connection_string

    application_stack {
      node_version = 18
    }

    cors {
      allowed_origins     = [
        "https://someroc.azurewebsites.net/",
      ]
    }
  }

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}