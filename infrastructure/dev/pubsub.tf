
resource "azurerm_web_pubsub" "pubsub" {
  name                = "wps-${var.workload_name}-${var.env}"
  location            = azurerm_resource_group.dev.location
  resource_group_name = azurerm_resource_group.dev.name

  sku      = "Free_F1"
  capacity = 1

  tags = local.tags

  public_network_access_enabled = false

  live_trace {
    enabled                   = true
    messaging_logs_enabled    = true
    connectivity_logs_enabled = false
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
    url_template       = "https://large-months-add-213-10-31-95.loca.lt/api/{hub}/{event}"
    user_event_pattern = "*"
    system_events      = ["connect", "connected", "disconnected", "gameAction"]
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
