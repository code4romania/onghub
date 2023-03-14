resource "aws_cloudwatch_log_group" "amplify_login_create_auth_challenge" {
  name              = "/aws/lambda/${aws_lambda_function.amplify_login_create_auth_challenge.function_name}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "amplify_login_define_auth_challenge" {
  name              = "/aws/lambda/${aws_lambda_function.amplify_login_define_auth_challenge.function_name}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "amplify_login_verify_auth_challenge_response" {
  name              = "/aws/lambda/${aws_lambda_function.amplify_login_verify_auth_challenge_response.function_name}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "amplify_login_custom_message" {
  name              = "/aws/lambda/${aws_lambda_function.amplify_login_custom_message.function_name}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "login_pre_authentication_check" {
  name              = "/aws/lambda/${aws_lambda_function.login_pre_authentication_check.function_name}"
  retention_in_days = 30
}
