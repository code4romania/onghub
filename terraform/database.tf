resource "aws_db_instance" "db_instance" {
  identifier          = local.namespace
  db_name             = "onghub"
  instance_class      = "db.t4g.micro"
  multi_az            = false
  publicly_accessible = false
  deletion_protection = var.env == "production"

  username = "postgres"
  password = random_password.db_pass.result

  iam_database_authentication_enabled = true

  engine                      = "postgres"
  engine_version              = "13.10"
  allow_major_version_upgrade = false
  auto_minor_version_upgrade  = true

  # storage
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true

  # backup
  backup_retention_period = 30
  backup_window           = "01:00-01:30"
  copy_tags_to_snapshot   = true
  skip_final_snapshot     = true

  maintenance_window = "Wed:01:45-Wed:03:00"

  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.database.id]
}

resource "aws_security_group" "database" {
  name        = "${local.namespace}-rds"
  description = "Inbound - Security Group attached to the RDS instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = "5432"
    to_port     = "5432"
    protocol    = "tcp"
    cidr_blocks = [local.vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
