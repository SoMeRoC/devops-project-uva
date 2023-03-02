resource "azurerm_resource_group" "dev" {
  name     = "rg-${var.workload_name}-${var.env}"
  location = "westeurope"
  tags     = merge(local.tags, {"WorkloadName" : var.workload_name})

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}

resource "azurerm_resource_group" "frontend" {
  name     = "rg-${var.workload_name}-frontEnd-${var.env}"
  location = "westeurope"
  tags     = merge(local.tags, {"WorkloadName" : var.workload_name})

  lifecycle {
    ignore_changes = [
      tags,
    ]
  }
}

