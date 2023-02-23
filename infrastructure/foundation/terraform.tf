# Configure Terraform to set the required AzureRM provider
# version and features{} block.

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.44.1"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "= 2.34.1"
    }
  }
}

terraform {
  backend "azurerm" {
  }
}

provider "azurerm" {
  features {}
  subscription_id = "dbd032c4-aaab-435a-93f8-135657f8985c"
}

provider "azurerm" {
  alias           = "management"
  subscription_id = "dbd032c4-aaab-435a-93f8-135657f8985c"
  features {}
}

provider "azurerm" {
  alias           = "connectivity"
  subscription_id = "dbd032c4-aaab-435a-93f8-135657f8985c"
  features {}
}
