# Use variables to customize the deployment

variable "root_id" {
  type    = string
  default = "jorrit"
}

variable "root_name" {
  type    = string
  default = "jorrit-core"
}

variable "management_root_group_id" {
  type    = string
  default = "/providers/Microsoft.Management/managementGroups/db02e38a-3a2b-4c8f-b937-b835f156198b"
}

variable "postfix" {
  type = string
  default = "prd-weu-001"
}
