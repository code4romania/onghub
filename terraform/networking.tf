data "aws_availability_zones" "current" {
  state = "available"
}

resource "aws_vpc" "main" {
  cidr_block           = local.vpc.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_subnet" "public" {
  count                   = length(data.aws_availability_zones.current.names)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = element(local.vpc.public_subnets, count.index)
  availability_zone       = element(data.aws_availability_zones.current.names, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name   = format("%s-public-%0.2d", local.namespace, count.index + 1)
    access = "public"
  }
}

resource "aws_subnet" "private" {
  count                   = length(data.aws_availability_zones.current.names)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = element(local.vpc.private_subnets, count.index)
  availability_zone       = element(data.aws_availability_zones.current.names, count.index)
  map_public_ip_on_launch = false

  tags = {
    Name   = format("%s-private-%0.2d", local.namespace, count.index + 1)
    access = "private"
  }
}

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${local.namespace}-db-private"
  subnet_ids = aws_subnet.private.*.id

  tags = {
    access = "private"
  }
}

resource "aws_elasticache_subnet_group" "elasticache_subnet_group" {
  name       = "${local.namespace}-elasticache-private"
  subnet_ids = aws_subnet.private.*.id

  tags = {
    access = "private"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = local.namespace
  }
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat_gateway.id
  subnet_id     = aws_subnet.public.0.id

  tags = {
    Name = local.namespace
  }
}

resource "aws_eip" "nat_gateway" {
  vpc = true
  tags = {
    Name = "${local.namespace}-nat-gateway"
  }
}

resource "aws_eip" "bastion" {
  instance = aws_instance.bastion.id
  vpc      = true
  tags = {
    Name = "${local.namespace}-bastion"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "${local.namespace}-public"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway.id
  }

  tags = {
    Name = "${local.namespace}-private"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(data.aws_availability_zones.current.names)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = length(data.aws_availability_zones.current.names)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = aws_route_table.private.id
}
