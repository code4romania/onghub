resource "aws_amplify_app" "amplify_app" {
  name       = "${local.namespace}-amplify-app"
  repository = "https://github.com/code4romania/onghub"

  access_token = var.github_access_token

  build_spec = file("${path.module}/amplify/amplify.yml")

  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }

  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }
}

resource "aws_amplify_branch" "branch" {
  app_id      = aws_amplify_app.amplify_app.id
  branch_name = var.env == "production" ? "main" : "develop"
  stage       = var.env == "production" ? "PRODUCTION" : "BETA"
  framework   = "React"

  enable_auto_build = true

  environment_variables = {
    AMPLIFY_DIFF_DEPLOY            = false
    AMPLIFY_MONOREPO_APP_ROOT      = "frontend"
    REACT_APP_API_URL              = "https://${aws_apprunner_service.backend.service_url}"
    REACT_APP_AWS_REGION           = var.region
    REACT_APP_COGNITO_OAUTH_DOMAIN = "${aws_cognito_user_pool_domain.domain.domain}.auth.${var.region}.amazoncognito.com"
    REACT_APP_FRONTEND_URL         = "https://${local.frontend_domain}"
    REACT_APP_USER_POOL_CLIENT_ID  = aws_cognito_user_pool_client.onghub_client.id
    REACT_APP_USER_POOL_ID         = aws_cognito_user_pool.pool.id
  }
}

resource "aws_amplify_domain_association" "domain" {
  app_id      = aws_amplify_app.amplify_app.id
  domain_name = local.frontend_domain

  sub_domain {
    branch_name = aws_amplify_branch.branch.branch_name
    prefix      = ""
  }
}
