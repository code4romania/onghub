resource "aws_amplify_app" "practice4good" {
  name       = "${local.practice4good.namespace}-amplify-app"
  repository = "https://github.com/code4romania/practice-for-good"

  access_token = var.github_access_token

  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }

  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|webp|woff|ttf|map|json)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }
}

resource "aws_amplify_branch" "practice4good" {
  app_id      = aws_amplify_app.practice4good.id
  branch_name = var.env == "production" ? "main" : "develop"
  stage       = var.env == "production" ? "PRODUCTION" : "BETA"
  framework   = "React"

  enable_auto_build = true

  environment_variables = {
    AMPLIFY_DIFF_DEPLOY               = false
    REACT_APP_API_URL                 = "https://${aws_apprunner_service.backend.service_url}"
    REACT_APP_CREATE_ONG_PROFILE_LINK = "https://${local.frontend_domain}/new"
  }
}

resource "aws_amplify_domain_association" "practice4good" {
  app_id      = aws_amplify_app.practice4good.id
  domain_name = local.practice4good.frontend_domain

  sub_domain {
    branch_name = aws_amplify_branch.practice4good.branch_name
    prefix      = ""
  }
}
