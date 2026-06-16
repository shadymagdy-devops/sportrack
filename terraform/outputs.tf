# terraform/outputs.tf

output "master_public_ip" {
  description = "Public IP of the Kubernetes master node"
  value       = aws_eip.master.public_ip
}

output "worker_public_ips" {
  description = "Public IPs of worker nodes"
  value       = aws_instance.k8s_workers[*].public_ip
}

output "ssh_master_command" {
  description = "SSH command to connect to master"
  value       = "ssh -i ~/.ssh/sporttrack-key.pem ubuntu@${aws_eip.master.public_ip}"
}

output "ansible_inventory_hint" {
  description = "Paste into ansible/inventory.ini"
  value       = <<-EOT
    [masters]
    k8s-master ansible_host=${aws_eip.master.public_ip}

    [workers]
    ${join("\n", [for i, ip in aws_instance.k8s_workers[*].public_ip : "k8s-worker-${i + 1} ansible_host=${ip}"])}
  EOT
}
