resource aws_elasticache_subnet_group group {
  name       = "tf-test-cache-subnet"
  subnet_ids = var.vpc_subnets
}

resource aws_elasticache_cluster redis {
  cluster_id           = "dev-concurrency-service"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis5.0"
  engine_version       = "5.0.6"
  port                 = 6379
  security_group_ids = list(var.security_group_id)
  subnet_group_name = aws_elasticache_subnet_group.group.name
  tags = var.tags
}
