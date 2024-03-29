
resource "azurerm_web_pubsub" "pubsub" {
  name                = "wps-${var.workload_name}-${var.env}"
  location            = azurerm_resource_group.dev.location
  resource_group_name = azurerm_resource_group.dev.name

  sku      = "Standard_S1"
  capacity = 1

  tags = local.tags

  public_network_access_enabled = true

  live_trace {
    enabled                   = true
    messaging_logs_enabled    = true
    connectivity_logs_enabled = true
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


resource "azurerm_web_pubsub_hub" "hub" {
  name          = "session_hub"
  web_pubsub_id = azurerm_web_pubsub.pubsub.id

  event_handler {
    url_template       = "https://${module.session_management.default_hostname}/api/{event}"
    user_event_pattern = "*"
    system_events      = ["connect", "connected", "disconnected"]
  }

  # event_handler {
  #   url_template       = "https://test.com/api/{hub}/{event}"
  #   user_event_pattern = "event1, event2"
  #   system_events      = ["connected"]
  #   auth {
  #     managed_identity_id = azurerm_user_assigned_identity.example.id
  #   }
  # }

  anonymous_connections_enabled = false

  depends_on = [
    azurerm_web_pubsub.pubsub
  ]
}

resource "azurerm_web_pubsub_hub" "hub_dev" {
  name          = "session_hub_dev"
  web_pubsub_id = azurerm_web_pubsub.pubsub.id

  event_handler {
    url_template       = "https://3000.home.qrcsoftware.nl/api/{event}"
    user_event_pattern = "*"
    system_events      = ["connect", "connected", "disconnected"]
  }

  anonymous_connections_enabled = false

  depends_on = [
    azurerm_web_pubsub.pubsub
  ]
}
