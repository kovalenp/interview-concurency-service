provider "aws" {
  profile = "default"
  region = "us-east-1"
}

locals {
  service_name = "pk-concurrency-service"
  
  tags = {
    Application = "Kovalenko interview"
    Environment = "Development"
    Name = local.service_name
  }
}

module vpc {
  source = "./vpc"
  service_name = local.service_name
  tags = local.tags
}

module lambda_function {
  source = "./lambda"
  service_name = local.service_name
  timestamp = timestamp()
  service_version = "alpha"
  security_group_id = module.vpc.private_security_group_id
  private_subnets = module.vpc.private_subnets
  tags = local.tags
}

module lb {
  source = "./alb"
  security_group_id = module.vpc.public_security_group_id
  service_name = local.service_name
  manifest_lambda_function_arn = module.lambda_function.manifest_lambda_arn
  vpc_id      = module.vpc.vpc_id
  vpc_subnets = module.vpc.public_subnets
  tags = local.tags
}

output load_balancer_dns {
  value = module.lb.dns
  description = "service DNS name"
}