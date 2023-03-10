resource "aws_apprunner_service" "backend" {
  service_name = local.namespace

  instance_configuration {
    cpu               = 1024
    memory            = 2048
    instance_role_arn = aws_iam_role.runner_role.arn
  }

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.runner_role.arn
    }

    image_repository {
      image_configuration {
        runtime_environment_variables = {
          ONGHUB_URL     = "https://${local.frontend_domain}"
          ENCRYPTION_KEY = var.onghub_hmac_encryption_key
          NODE_ENV       = var.env
          PORT           = "80"

          COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.onghub_client.id
          COGNITO_REGION       = var.region
          COGNITO_USER_POOL_ID = aws_cognito_user_pool.pool.id

          DATABASE_HOST     = aws_db_instance.db_instance.address
          DATABASE_PORT     = aws_db_instance.db_instance.port
          DATABASE_NAME     = aws_db_instance.db_instance.db_name
          DATABASE_USER     = aws_db_instance.db_instance.username
          DATABASE_PASSWORD = aws_db_instance.db_instance.password

          MAIL_HOST    = "email-smtp.${var.region}.amazonaws.com"
          MAIL_PORT    = 587
          MAIL_USER    = aws_iam_access_key.iam_user_key.id
          MAIL_PASS    = aws_iam_access_key.iam_user_key.ses_smtp_password_v4
          MAIL_FROM    = "no-reply@${local.mail_domain}"
          MAIL_CONTACT = "no-reply@${local.mail_domain}"

          AWS_ACCESS_KEY_ID         = aws_iam_access_key.iam_user_key.id
          AWS_SECRET_ACCESS_KEY     = aws_iam_access_key.iam_user_key.secret
          AWS_S3_BUCKET_NAME        = aws_s3_bucket.files.bucket
          AWS_S3_BUCKET_NAME_PUBLIC = "${aws_s3_bucket.files.bucket_regional_domain_name}/public"

          REDIS_HOST = aws_elasticache_cluster.redis.cache_nodes.0.address
          REDIS_PORT = aws_elasticache_cluster.redis.port

          THROTTLE_LIMIT = "600"
          THROTTLE_TTL   = "60"
          CACHE_TTL      = "600"
        }

        port = "80"
      }

      image_identifier      = "${local.image.repo}:${local.image.tag}"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = true
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.connector.arn
    }
  }
}


resource "aws_apprunner_vpc_connector" "connector" {
  vpc_connector_name = "${local.namespace}-vpc_connector"
  subnets            = aws_subnet.private.*.id
  security_groups = [
    aws_security_group.database.id,
    aws_security_group.elasticache.id
  ]

  lifecycle {
    ignore_changes = [tags_all]
  }
}

resource "aws_apprunner_custom_domain_association" "domain" {
  domain_name = local.backend_domain
  service_arn = aws_apprunner_service.backend.arn
}
