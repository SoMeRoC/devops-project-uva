
resource "azurerm_application_insights" "appi" {
  name                = "appi-${var.workload_name}-${var.env}"
  location            = azurerm_resource_group.dev.location
  resource_group_name = azurerm_resource_group.dev.name
  application_type    = "Node.JS"
  workspace_id        = data.azurerm_log_analytics_workspace.la.id
  retention_in_days   = 30
  daily_data_cap_in_gb = 1
}
