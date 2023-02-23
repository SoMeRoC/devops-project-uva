
resource "azurerm_service_plan" "app" {
  name                = "apps-FrontEnd-${var.env}"
  resource_group_name = azurerm_resource_group.dev.name
  location            = azurerm_resource_group.dev.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "example" {
  name                = "web-${var.workload_name}-FrontEnd-${var.env}"
  resource_group_name = azurerm_resource_group.dev.name
  location            = azurerm_service_plan.app.location
  service_plan_id     = azurerm_service_plan.app.id


  site_config {
    application_insights_connection_string = var.application_insights_connection_string
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