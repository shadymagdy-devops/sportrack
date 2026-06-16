# terraform/variables.tf

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "sporttrack"
}

variable "worker_count" {
  description = "Number of k8s worker nodes (use 1 for free tier, each t2.micro is free)"
  type        = number
  default     = 1
}

variable "public_key_path" {
  description = "Path to your SSH public key"
  type        = string
  default     = "~/.ssh/sporttrack-key.pub"
}

variable "my_ip_cidr" {
  description = "Your IP address in CIDR notation for SSH access (e.g. 1.2.3.4/32)"
  type        = string
  # Find your IP: curl ifconfig.me
}
