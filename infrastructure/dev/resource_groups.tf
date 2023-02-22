resource "azurerm_resource_group" "dev" {
  name     = "rg-inititalfunc-${var.env}"
  location = "westeurope"
  tags     = merge(local.tags, {"WorkloadName" : var.workload_name})

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}
