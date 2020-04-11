data aws_region current {}

locals {
  lb_routes = [
    "/version",
    "/health",
    "/concurrent"
  ]
  global_resource_prefix = "dev-${data.aws_region.current.name}"
  target_group_name = "${var.service_name}-tg"
  lb_name = "${var.service_name}-lb"
}

resource aws_lb lb {
  name = local.lb_name
  internal = false
  load_balancer_type = "application"
  security_groups = list(var.security_group_id)
  subnets = var.vpc_subnets
  enable_deletion_protection = false
  tags = var.tags
}

resource aws_lb_listener listener {
  load_balancer_arn = aws_lb.lb.arn
  port = "80"
  protocol = "HTTP"
 
  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "ALB is OK"
      status_code  = "200"
    }
  }
}

resource aws_lb_listener_rule manifest_lambda_listener_rules {
  count = length(local.lb_routes)
  listener_arn = aws_lb_listener.listener.arn
  priority = tonumber("10${count.index}")

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }

  condition {
    field = "path-pattern"
    values = [
      local.lb_routes[count.index]
    ]
  }
}

resource aws_lb_target_group_attachment manifest_lambda_tg_attachment {
  target_group_arn = aws_lb_target_group.target_group.arn
  target_id = var.manifest_lambda_function_arn
  depends_on = [aws_lambda_permission.manifest_lambda_permission]
}

resource aws_lb_target_group target_group {
  name        = local.target_group_name
  target_type = "lambda"

  health_check {
    enabled = true
    interval = 300
    timeout = 30
    path = "/health"
    healthy_threshold = 2
    unhealthy_threshold = 2
    matcher = "200-202"
  }

  tags = var.tags
}

resource aws_lambda_permission manifest_lambda_permission {
  statement_id = "AllowExecutionFromlb"
  action = "lambda:InvokeFunction"
  function_name = var.manifest_lambda_function_arn
  principal = "elasticloadbalancing.amazonaws.com"
  source_arn = aws_lb_target_group.target_group.arn
}
