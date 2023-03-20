
resource "azurerm_app_configuration" "appconf" {
  name                = "ac-${var.workload_name}-${var.product_name}-${var.env}"
  resource_group_name = azurerm_resource_group.shared.name
  location            = azurerm_resource_group.shared.location

  sku = "free"
  tags = local.tags


  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}