output "principal_id" {
  value = azurerm_linux_function_app.func.identity[0].principal_id
  sensitive = true
}

output "default_hostname" {
  value = azurerm_linux_function_app.func.default_hostname
}
