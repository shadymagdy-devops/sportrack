# terraform/main.tf
# AWS Free Tier infrastructure for SportTrack
# Resources used: EC2 t2.micro, RDS (optional), EKS (costs ~$0.10/hr for control plane)
#
# NOTE: EKS control plane costs ~$72/month. For true free tier:
#       use kubeadm on EC2 t2.micro instead (see ansible playbooks).
#       This file shows the proper AWS/EKS pattern for learning.

terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Store state in S3 (free — just pay for storage cents)
  # Uncomment after creating the bucket manually first:
  # backend "s3" {
  #   bucket = "sporttrack-tfstate"
  #   key    = "sporttrack/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# ── Data sources ──────────────────────────────────────────────────────────────
data "aws_availability_zones" "available" {}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-22.04-amd64-server-*"]
  }
}

# ── VPC ───────────────────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "${var.project_name}-vpc" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project_name}-igw" }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "${var.project_name}-public-${count.index + 1}" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = { Name = "${var.project_name}-rt-public" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ── Security Groups ───────────────────────────────────────────────────────────
resource "aws_security_group" "app" {
  name        = "${var.project_name}-sg"
  description = "SportTrack app security group"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip_cidr]   # restrict SSH to your IP only
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # restrict in prod
  }

  # Kubernetes API server (for kubeadm setup)
  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = [var.my_ip_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-sg" }
}

# ── EC2 Key Pair ──────────────────────────────────────────────────────────────
resource "aws_key_pair" "sporttrack" {
  key_name   = "${var.project_name}-key"
  public_key = file(var.public_key_path)
}

# ── EC2 Instances (FREE TIER: t2.micro) ──────────────────────────────────────
resource "aws_instance" "k8s_master" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro"      # free tier eligible
  subnet_id              = aws_subnet.public[0].id
  key_name               = aws_key_pair.sporttrack.key_name
  vpc_security_group_ids = [aws_security_group.app.id]

  root_block_device {
    volume_size = 20    # 20 GB free tier
    volume_type = "gp2"
  }

  user_data = <<-EOF
    #!/bin/bash
    hostnamectl set-hostname k8s-master
    echo "127.0.0.1 k8s-master" >> /etc/hosts
  EOF

  tags = { Name = "${var.project_name}-master", Role = "master" }
}

resource "aws_instance" "k8s_workers" {
  count                  = var.worker_count
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public[count.index % 2].id
  key_name               = aws_key_pair.sporttrack.key_name
  vpc_security_group_ids = [aws_security_group.app.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  user_data = <<-EOF
    #!/bin/bash
    hostnamectl set-hostname k8s-worker-${count.index + 1}
  EOF

  tags = { Name = "${var.project_name}-worker-${count.index + 1}", Role = "worker" }
}

# ── Elastic IPs ───────────────────────────────────────────────────────────────
resource "aws_eip" "master" {
  instance = aws_instance.k8s_master.id
  domain   = "vpc"
  tags     = { Name = "${var.project_name}-master-eip" }
}
