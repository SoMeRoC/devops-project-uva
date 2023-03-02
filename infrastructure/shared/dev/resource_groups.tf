resource "azurerm_resource_group" "shared" {
  name     = "rg-${var.workload_name}-shared-${var.env}"
  location = "westeurope"
  tags     = merge(local.tags, {"WorkloadName" : var.workload_name, "ProductName" : "shared"} )

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}
