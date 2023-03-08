module "user_management" {
  source  = "../modules/function_app"

  name                = "func-${var.workload_name}-userManagement-${var.env}"
  product_name        = "userManagement"
  resource_group_name = azurerm_resource_group.dev.name
  location            = azurerm_resource_group.dev.location
  tags = local.tags
  storage_account_name       = azurerm_storage_account.func_storage.name
  storage_account_access_key = azurerm_storage_account.func_storage.primary_access_key
  application_insights_connection_string = azurerm_application_insights.appi.connection_string
}

# module "session_management" {
#   source  = "../modules/function_app"

#   name                = "func-${var.workload_name}-sessionManagement-${var.env}"
#   product_name        = "sessionManagement"
#   resource_group_name = azurerm_resource_group.dev.name
#   location            = azurerm_resource_group.dev.location
#   tags = local.tags
#   storage_account_name       = azurerm_storage_account.func_storage.name
#   storage_account_access_key = azurerm_storage_account.func_storage.primary_access_key
#   application_insights_connection_string = azurerm_application_insights.appi.connection_string
# }

# module "match_making" {
#   source  = "../modules/function_app"

#   name                = "func-${var.workload_name}-matchMaking-${var.env}"
#   product_name        = "matchMaking"
#   resource_group_name = azurerm_resource_group.dev.name
#   location            = azurerm_resource_group.dev.location
#   tags = local.tags
#   storage_account_name       = azurerm_storage_account.func_storage.name
#   storage_account_access_key = azurerm_storage_account.func_storage.primary_access_key
#   application_insights_connection_string = azurerm_application_insights.appi.connection_string
# }


# module "game" {
#   source  = "../modules/function_app"

#   name                = "func-${var.workload_name}-game-${var.env}"
#   product_name        = "game"
#   resource_group_name = azurerm_resource_group.dev.name
#   location            = azurerm_resource_group.dev.location
#   tags = local.tags
#   storage_account_name       = azurerm_storage_account.func_storage.name
#   storage_account_access_key = azurerm_storage_account.func_storage.primary_access_key
#   application_insights_connection_string = azurerm_application_insights.appi.connection_string
# }
