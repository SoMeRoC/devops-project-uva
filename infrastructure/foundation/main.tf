data "azurerm_client_config" "core" {
  provider = azurerm
}

# Obtain client configuration from the "management" provider
data "azurerm_client_config" "management" {
  provider = azurerm.management
}

# Obtain client configuration from the "connectivity" provider
data "azurerm_client_config" "connectivity" {
  provider = azurerm.connectivity
}

module "enterprise_scale" {
  source  = "Azure/caf-enterprise-scale/azurerm"
  version = "3.2.0"

  # Map each module provider to their corresponding `azurerm` provider using the providers input object, this enables multi subscription deployments

  providers = {
    azurerm              = azurerm
    azurerm.connectivity = azurerm
    azurerm.management   = azurerm
  }

  # Base module configuration settings
  root_parent_id    = data.azurerm_client_config.core.tenant_id
  root_id           = var.root_id
  root_name         = var.root_name
  library_path      = "${path.root}/lib"
  default_tags      = local.default_tags
  disable_telemetry = true

  deploy_identity_resources     = false
  deploy_connectivity_resources = false

  # Configuration settings for management resources
  deploy_management_resources    = true
  configure_management_resources = local.configure_management_resources
  subscription_id_management     = data.azurerm_client_config.management.subscription_id

  deploy_core_landing_zones = true
  custom_landing_zones = local.custom_landing_zones
}