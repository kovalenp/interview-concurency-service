data aws_region current {}

data aws_iam_policy_document policy {
  statement {
    sid = ""
    effect = "Allow"

    principals {
      identifiers = ["lambda.amazonaws.com"]
      type = "Service"
    }

    actions = ["sts:AssumeRole"]
  }
}

data aws_iam_policy_document lambda_logging  {
  statement {
    sid = ""
    effect = "Allow"

    resources = [
      "arn:aws:logs:*:*:*",
    ]

    actions = [ "logs:CreateLogStream", "logs:PutLogEvents"]
  }
}

locals {
  lambda_function_name = "${var.service_name}-lambda"
  lambda_package_path = "${path.module}/../../build/package.zip"
}

resource aws_iam_role iam_for_lambda {
  name = "${local.lambda_function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.policy.json
}

resource aws_cloudwatch_log_group lambda_log_group {
  name = "/aws/lambda/${local.lambda_function_name}"
  tags = var.tags
}

resource aws_iam_policy lambda_logging {
  name = "${aws_iam_role.iam_for_lambda.name}-logging"
  path = "/"
  description = "IAM policy for logging from a lambda"
  policy = data.aws_iam_policy_document.lambda_logging.json
}

resource aws_iam_role_policy_attachment lambda_logs {
  role = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource aws_lambda_function lambda_function {
  filename = local.lambda_package_path
  function_name = local.lambda_function_name
  description = "Version ${var.service_version} published on ${var.timestamp}"
  role = aws_iam_role.iam_for_lambda.arn
  handler = "src/index.handler"
  source_code_hash = base64sha256(local.lambda_package_path)
  runtime = "nodejs12.x"
  timeout = 30
  memory_size = 512

  environment {
    variables = {
      CONFIG_ENV = "development"
    }
  }

  publish = true

  tags = var.tags

 depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.lambda_log_group,
  ]
}
