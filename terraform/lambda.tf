# amplify_login_create_auth_challenge
data "archive_file" "amplify_login_create_auth_challenge" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/amplify_login_create_auth_challenge"
  output_path = "${path.module}/lambda/amplify_login_create_auth_challenge.zip"
}

resource "aws_lambda_function" "amplify_login_create_auth_challenge" {
  function_name    = "amplify_login_create_auth_challenge"
  filename         = data.archive_file.amplify_login_create_auth_challenge.output_path
  role             = aws_iam_role.amplify_login_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  source_code_hash = data.archive_file.amplify_login_create_auth_challenge.output_base64sha256
}

resource "aws_lambda_permission" "amplify_login_create_auth_challenge_permission" {
  statement_id  = "createAuthChallenge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.amplify_login_create_auth_challenge.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

# amplify_login_define_auth_challenge
data "archive_file" "amplify_login_define_auth_challenge" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/amplify_login_define_auth_challenge"
  output_path = "${path.module}/lambda/amplify_login_define_auth_challenge.zip"
}

resource "aws_lambda_function" "amplify_login_define_auth_challenge" {
  function_name    = "amplify_login_define_auth_challenge"
  filename         = data.archive_file.amplify_login_define_auth_challenge.output_path
  role             = aws_iam_role.amplify_login_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  source_code_hash = data.archive_file.amplify_login_define_auth_challenge.output_base64sha256
}

resource "aws_lambda_permission" "amplify_login_define_auth_challenge_permission" {
  statement_id  = "defineAuthChallenge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.amplify_login_define_auth_challenge.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

# amplify_login_verify_auth_challenge_response
data "archive_file" "amplify_login_verify_auth_challenge_response" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/amplify_login_verify_auth_challenge_response"
  output_path = "${path.module}/lambda/amplify_login_verify_auth_challenge_response.zip"
}

resource "aws_lambda_function" "amplify_login_verify_auth_challenge_response" {
  function_name    = "amplify_login_verify_auth_challenge_response"
  filename         = data.archive_file.amplify_login_verify_auth_challenge_response.output_path
  role             = aws_iam_role.amplify_login_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  source_code_hash = data.archive_file.amplify_login_verify_auth_challenge_response.output_base64sha256
}

resource "aws_lambda_permission" "amplify_login_verify_auth_challenge_response" {
  statement_id  = "verifyAuthChallenge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.amplify_login_verify_auth_challenge_response.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

# amplify_login_custom_message
data "archive_file" "amplify_login_custom_message" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/amplify_login_custom_message"
  output_path = "${path.module}/lambda/amplify_login_custom_message.zip"
}

resource "aws_lambda_function" "amplify_login_custom_message" {
  function_name    = "amplify_login_custom_message"
  filename         = data.archive_file.amplify_login_custom_message.output_path
  role             = aws_iam_role.amplify_login_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  source_code_hash = data.archive_file.amplify_login_custom_message.output_base64sha256
}

resource "aws_lambda_permission" "amplify_login_custom_message" {
  statement_id  = "customMessageTrigger"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.amplify_login_custom_message.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.pool.arn
}

# login_pre_authentication_check
data "archive_file" "login_pre_authentication_check" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/login_pre_authentication_check"
  output_path = "${path.module}/lambda/login_pre_authentication_check.zip"

  depends_on = [
    null_resource.login_pre_authentication_check
  ]
}

# Provisioner to install dependencies in lambda package before upload it.
resource "null_resource" "login_pre_authentication_check" {

  triggers = {
    updated_at = timestamp()
  }

  provisioner "local-exec" {
    command = <<EOF
    npm install
    EOF

    working_dir = "${path.module}/lambda/login_pre_authentication_check"
  }
}

resource "aws_lambda_function" "login_pre_authentication_check" {
  function_name    = "login_pre_authentication_check"
  filename         = data.archive_file.login_pre_authentication_check.output_path
  role             = aws_iam_role.amplify_login_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  source_code_hash = data.archive_file.login_pre_authentication_check.output_base64sha256

  environment {
    variables = {
      onghub_cognito_client_id : var.onghub_cognito_client_idonghub_client.id
      onghub_api_url : var.onghub_api_url
      onghub_api_check_access_endpoint : "hasAccess",
      onghub_hmac_api_key : var.onghub_hmac_api_key
      onghub_hmac_secret_key : var.onghub_hmac_secret_key
    }
  }
}

# # To give an external source (like an EventBridge Rule, SNS, or S3) permission to access the Lambda function, use the aws_lambda_permission resource.
# resource "aws_lambda_permission" "login_pre_authentication_check_permission" {
#   statement_id  = "createAuthChallenge"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.login_pre_authentication_check.function_name
#   principal     = "cognito-idp.amazonaws.com"
#   source_arn    = aws_cognito_user_pool.pool.arn
# }
