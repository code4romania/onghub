output "db_password" {
  value     = aws_db_instance.db_instance.password
  sensitive = true
}
