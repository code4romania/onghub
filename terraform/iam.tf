resource "aws_iam_user" "iam_user" {
  name = "${local.namespace}-user"
}

resource "aws_iam_access_key" "iam_user_key" {
  user = aws_iam_user.iam_user.name
}

resource "aws_iam_role" "runner_role" {
  name = "${local.namespace}-apprunner-role"

  assume_role_policy = data.aws_iam_policy_document.runner_role_policy.json
}

resource "aws_iam_role_policy_attachment" "runner_role_ecr_policy_attachment" {
  role       = aws_iam_role.runner_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_iam_role" "amplify_login_lambda" {
  name               = "${local.namespace}-amplify-login-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_policy.json
}

resource "aws_iam_policy" "amplify_backend" {
  name   = "amplify-backend"
  policy = data.aws_iam_policy_document.amplify_login_lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "attach_amplify_login_lambda_policy_to_lambda_role" {
  role       = aws_iam_role.amplify_login_lambda.name
  policy_arn = aws_iam_policy.amplify_backend.arn
}

resource "aws_iam_user_policy" "files_access_policy" {
  name   = "s3-files-access-policy"
  user   = aws_iam_user.iam_user.name
  policy = data.aws_iam_policy_document.bucket_acccess.json
}

resource "aws_iam_user_policy_attachment" "cognito_power_user_policy_attachment" {
  user       = aws_iam_user.iam_user.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
}

resource "aws_ses_identity_policy" "email_send_policy" {
  identity = data.aws_ses_domain_identity.main.arn
  name     = "email-send-policy"
  policy   = data.aws_iam_policy_document.ses_email_send.json
}
