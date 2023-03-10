resource "random_password" "db_pass" {
  length           = 32
  special          = true
  override_special = "!#$%&*-+_=[({?"

  lifecycle {
    ignore_changes = [
      length,
      special,
      override_special
    ]
  }
}
