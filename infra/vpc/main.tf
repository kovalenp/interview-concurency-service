data aws_availability_zones available {}

locals {
  az_number = 2
  sg_public_name = "${var.service_name}-public-sg"
  sg_private_name = "${var.service_name}-private-sg"
}

resource aws_vpc main {
  cidr_block = "100.0.0.0/16" # random range
  tags = var.tags
}

resource aws_subnet private {
  count = local.az_number
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = var.tags
}

resource aws_subnet public {
  count = local.az_number
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + local.az_number)
  availability_zone= data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags = var.tags
}

resource aws_internet_gateway main {
  vpc_id = aws_vpc.main.id
  tags = var.tags
}

resource aws_route internet_access {
  gateway_id = aws_internet_gateway.main.id
  route_table_id = aws_vpc.main.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
}

resource aws_route_table private {
  count = local.az_number
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = var.tags
}

resource aws_route_table_association private {
  count  = local.az_number
  subnet_id = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

resource aws_security_group public_sg {
  name        = local.sg_public_name
  description = "Concurency sg for public resources"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = list("0.0.0.0/0")
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource aws_security_group private_sg {
  name        = local.sg_private_name
  description = "Concurency sg for private resources"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    security_groups = [aws_security_group.public_sg.id]
  }

  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = list("0.0.0.0/0")
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}