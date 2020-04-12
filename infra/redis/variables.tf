variable tags {
  type        = map
  description = "(Required) - Tags map for AWS resources"
}

variable vpc_subnets {
  type        = list
  description = "(Required) - List of subntes for Elasticache redis"
}

variable security_group_id {
  type        = string
  description = "(Required) - Id of security group for Elasticache redis"
}

variable service_name {
  type        = string
  description = "(Required) - Service name string to label resources"
}