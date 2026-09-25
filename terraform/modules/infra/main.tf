variable "environment" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "instance_count" {
  type    = number
  default = 1
}

variable "key_name" {
  type = string
}

variable "admin_cidr" {
  description = "Public IP allowed to SSH into the EC2 instance"
  type        = string
}

data "aws_ssm_parameter" "amazon_linux" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_security_group" "app_server" {
  name        = "app-server-${var.environment}-sg"
  description = "Security group for the GitOps app server"

  ingress {
    description = "SSH from administrator public IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "app-server-${var.environment}-sg"
    Environment = var.environment
  }
}

resource "aws_instance" "app_server" {
  count = var.instance_count

  ami           = data.aws_ssm_parameter.amazon_linux.value
  instance_type = var.instance_type
  key_name      = var.key_name 
  associate_public_ip_address = true

  vpc_security_group_ids = [
    aws_security_group.app_server.id
  ]

  tags = {
    Name        = "app-server-${var.environment}"
    Environment = var.environment
  }
}

output "instance_ips" {
  value = aws_instance.app_server[*].public_ip
}