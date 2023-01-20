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
