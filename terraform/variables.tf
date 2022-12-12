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
