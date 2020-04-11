variable service_version {
  type        = string
  description = "(Required) - Lambda package version(semver)"
}

variable service_name {
  type        = string
  description = "(Required) - Service name string to label resources"
}

variable timestamp {}

variable private_subnets {
  type        = list
  description = "(Required) - List of VPC subnets where the LB will be deployed"
}

variable security_group_id {
  type        = string
  description = "(Required) - Security group id where LB will be deployed"
}

variable tags {
  type        = map
  description = "(Required) - Tags map for AWS resources"
}