variable "admin_cidr" {
  description = "Public IP allowed to SSH into the EC2 instance"
  type        = string
}

module "dev_infra" {
  source = "../../modules/infra"

  environment    = "dev"
  instance_type  = "t3.micro"
  instance_count = 1
  key_name       = "gitops-devops-key"
  admin_cidr     = var.admin_cidr
}

output "instance_ips" {
  value = module.dev_infra.instance_ips
}
