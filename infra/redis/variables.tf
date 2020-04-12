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