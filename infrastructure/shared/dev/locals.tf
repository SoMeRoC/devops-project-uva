locals {
  tag_list = ["LatestUpdate", "environment", "WorkloadName"]
  tags = {
    "latestUpdate" : formatdate("YYYY-MM-DD", timestamp()),
    "environment" : var.env
    }
}
