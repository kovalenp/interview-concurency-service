variable vpc_id {
  type = string
  description = "(Required) - VPC ID"
}

variable tags {
  type = map
  description = "(Required) - Tags map for AWS resources"
}

variable vpc_subnets {
  type = list
  description = "(Required) - List of VPC subnets where the LB will be deployed"
}

variable security_group_id {
  type = string
  description = "(Required) - List of VPC subnets where the LB will be deployed"
}

variable manifest_lambda_function_arn {
  type = string
  description = "(Required) - Name of the lambda function"
}

variable service_name {
  type = string
  description = "(Required) - Service name string to label resources"
}