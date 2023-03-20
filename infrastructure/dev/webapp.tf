
resource "azurerm_service_plan" "app" {
  name                = "apps-FrontEnd-${var.env}"
  resource_group_name = azurerm_resource_group.frontend.name
  location            = azurerm_resource_group.frontend.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "fe" {
  name                = "web-${var.workload_name}-FrontEnd-${var.env}"
  resource_group_name = azurerm_resource_group.frontend.name
  location            = azurerm_service_plan.app.location
  service_plan_id     = azurerm_service_plan.app.id

  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.appi.connection_string
    "AZURE_APP_CONFIG_CONNECTION_STRING" = data.azurerm_key_vault_secret.appconf.value
  }

  site_config {
    application_stack {
        node_version = "18-lts"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
      site_config[0].app_command_line,
      tags,
    ]
  }
}
