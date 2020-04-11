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