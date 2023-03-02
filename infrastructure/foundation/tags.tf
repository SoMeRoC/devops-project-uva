locals {
  current_date = formatdate("YYYY-MM-DD", timestamp())
  tag_list = ["LatestUpdate", "Env", "WorkloadName", "Criticality", "BusinessUnit", "OpsTeam", "Manager"]
  tags = {
    "latestUpdate" : local.current_date,
    "Env" : "prd",
    "WorkloadName" : "platform",
    "Criticality" : "critical",
    "BusinessUnit" : "Shared",
    "Manager" : "jorstut@hotmail.com"
  }
}
