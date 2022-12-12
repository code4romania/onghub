terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.35"
    }
  }
}

provider "aws" {
  region = var.region

  profile = "onghub"

  default_tags {
    tags = {
      app = "onghub"
      env = var.env
    }
  }
}
