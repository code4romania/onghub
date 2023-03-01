resource "aws_cognito_user_pool_client" "teo_client" {
  name         = "${local.teo.namespace}-client"
  user_pool_id = aws_cognito_user_pool.pool.id

  access_token_validity = 1
  token_validity_units {
    access_token = "days"
  }

  callback_urls = [
    "https://${local.teo.frontend_domain}",
    # "https://${aws_amplify_app.amplify_app.default_domain}",
  ]
  logout_urls = [
    "https://${local.teo.frontend_domain}",
    # "https://${aws_amplify_app.amplify_app.default_domain}",
  ]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  supported_identity_providers         = ["COGNITO"]
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "profile",
  ]

  prevent_user_existence_errors = "ENABLED"

  enable_propagate_additional_user_context_data = false
  enable_token_revocation                       = true

  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]
}
