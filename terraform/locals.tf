locals {
  namespace       = "onghub-${var.env}"
  domain          = "onghub.ro"
  frontend_domain = var.env == "production" ? "app.${local.domain}" : "app-${var.env}.${local.domain}"
  backend_domain  = var.env == "production" ? "api.${local.domain}" : "api-${var.env}.${local.domain}"
  mail_domain     = "onghub.ro"

  image = {
    repo = data.aws_ecr_repository.ecr.repository_url
    tag  = "develop"
  }

  vpc = {
    cidr_block = "10.0.0.0/16"
    public_subnets = [
      "10.0.1.0/24",
      "10.0.2.0/24",
      "10.0.3.0/24"
    ]
    private_subnets = [
      "10.0.4.0/24",
      "10.0.5.0/24",
      "10.0.6.0/24"
    ]
  }
}
