variable "env" {
  description = "Environment"
  type        = string

  validation {
    condition     = contains(["production", "staging", "development"], var.env)
    error_message = "Allowed values for env are \"production\", \"staging\" or \"development\"."
  }
}

variable "region" {
  description = "Region where to deploy resources"
  type        = string
  default     = "eu-west-1"
}

variable "github_access_token" {
  type = string
}
variable "onghub_hmac_encryption_key" {
  type = string
}

variable "onghub_hmac_api_key" {
  type = string
}

variable "onghub_hmac_secret_key" {
  type = string
}

variable "onghub_cognito_client_id" {
  type = string
}

variable "onghub_api_url" {
  type = string
}
