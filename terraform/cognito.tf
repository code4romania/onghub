# TODO:
# - custom_domain
# - sms_configuration
# - email_sending_account = "DEVELOPER"

resource "aws_cognito_user_pool" "pool" {
  name = "${local.namespace}-pool"

  # When active, DeletionProtection prevents accidental deletion of your user pool.
  # Currently active only in production
  deletion_protection = var.env == "production" ? "ACTIVE" : "INACTIVE"

  username_attributes = [
    "email",
  ]

  auto_verified_attributes = [
    "email",
  ]

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  username_configuration {
    case_sensitive = false
  }

  mfa_configuration          = "ON"
  sms_authentication_message = "Your verification code is {####}."

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "Your verification code is {####}. "
    email_subject        = "Your verification code"
    sms_message          = "Your verification code is {####}. "
  }

  software_token_mfa_configuration {
    enabled = false
  }

  admin_create_user_config {
    allow_admin_create_user_only = true

    invite_message_template {
      email_message = "Your username is {username} and temporary password is {####}. "
      email_subject = "Your temporary password"
      sms_message   = "Your username is {username} and temporary password is {####}. "
    }
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }

    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 30
  }

  lambda_config {
    create_auth_challenge          = aws_lambda_function.amplify_login_create_auth_challenge.arn
    define_auth_challenge          = aws_lambda_function.amplify_login_define_auth_challenge.arn
    verify_auth_challenge_response = aws_lambda_function.amplify_login_verify_auth_challenge_response.arn
    custom_message                 = aws_lambda_function.amplify_login_custom_message.arn
  }
}

resource "aws_cognito_user_pool_client" "onghub_client" {
  name         = "${local.namespace}-client"
  user_pool_id = aws_cognito_user_pool.pool.id

  callback_urls = [
    "https://${local.frontend_domain}",
    # "https://${aws_amplify_app.amplify_app.default_domain}",
  ]
  logout_urls = [
    "https://${local.frontend_domain}",
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


resource "aws_cognito_user_pool_domain" "domain" {
  domain       = local.namespace
  user_pool_id = aws_cognito_user_pool.pool.id
}


resource "aws_cognito_user_pool_ui_customization" "ui" {
  css          = file("${path.module}/ui/custom.css")
  image_file   = filebase64("${path.module}/ui/logo.png")
  user_pool_id = aws_cognito_user_pool.pool.id
}
