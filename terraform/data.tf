data "aws_ses_domain_identity" "main" {
  domain = local.mail_domain
}

data "aws_iam_policy_document" "ses_email_send" {
  statement {
    actions = [
      "SES:SendEmail",
      "SES:SendRawEmail"
    ]

    resources = [data.aws_ses_domain_identity.main.arn]

    principals {
      type        = "AWS"
      identifiers = [aws_apprunner_service.backend.arn]
    }
  }
}

data "aws_iam_policy_document" "ecs_task_execution_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "runner_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }

    principals {
      type        = "Service"
      identifiers = ["tasks.apprunner.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
data "aws_iam_policy_document" "amplify_login_lambda_policy" {
  statement {
    actions = [
      "amplifybackend:GetToken",
      "amplifybackend:DeleteToken"
    ]

    resources = ["arn:aws:amplifybackend:*:*:/backend/*"]
  }

  statement {
    actions   = ["amplify:GetApp"]
    resources = ["*"]
  }
}
