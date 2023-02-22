resource "azurerm_resource_group" "dev" {
  name     = "rg-${var.workload_name}-cluster-${var.env}-${var.postfix}"
  location = "westeurope"
  tags     = merge(local.tags, {"WorkloadName" : var.workload_name})

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}
