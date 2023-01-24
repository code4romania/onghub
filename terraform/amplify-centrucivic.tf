resource "aws_amplify_app" "centrucivic" {
  name       = "${local.centrucivic.namespace}-amplify-app"
  repository = "https://github.com/code4romania/centrucivic"

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

resource "aws_amplify_branch" "centrucivic" {
  app_id      = aws_amplify_app.centrucivic.id
  branch_name = var.env == "production" ? "main" : "develop"
  stage       = var.env == "production" ? "PRODUCTION" : "BETA"
  framework   = "React"

  enable_auto_build = true

  environment_variables = {
    AMPLIFY_DIFF_DEPLOY               = false
    REACT_APP_API_URL                 = "https://${aws_apprunner_service.backend.service_url}"
    REACT_APP_CREATE_ONG_PROFILE_LINK = "https://${local.frontend_domain}/new"
    REACT_APP_P4G_LINK                = "https://${local.centrucivic.frontend_domain}"
  }
}

resource "aws_amplify_domain_association" "centrucivic" {
  app_id      = aws_amplify_app.centrucivic.id
  domain_name = local.centrucivic.frontend_domain

  sub_domain {
    branch_name = aws_amplify_branch.centrucivic.branch_name
    prefix      = ""
  }
}
