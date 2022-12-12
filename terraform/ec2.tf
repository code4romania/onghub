data "aws_ami" "amazon_linux_2" {
  owners      = ["amazon"]
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm*"]
  }
}

data "aws_key_pair" "bastion" {
  key_name = "${local.namespace}-bastion"
}

resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.amazon_linux_2.id
  instance_type               = "t3.nano"
  associate_public_ip_address = true
  source_dest_check           = false

  subnet_id              = aws_subnet.public.0.id
  private_ip             = cidrhost(aws_subnet.public.0.cidr_block, 20)
  vpc_security_group_ids = [aws_security_group.bastion.id]

  key_name = data.aws_key_pair.bastion.key_name

  ebs_optimized = true

  root_block_device {
    volume_type = "gp3"
    volume_size = 8
    encrypted   = true
  }

  lifecycle {
    ignore_changes = [ami, key_name]
  }

  tags = {
    Name = "${local.namespace}-bastion"
  }
}

resource "aws_security_group" "bastion" {
  name        = "${local.namespace}-bastion"
  description = "Inbound - Security Group attached to the bastion instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = "22"
    to_port     = "22"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = "443"
    to_port     = "443"
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
