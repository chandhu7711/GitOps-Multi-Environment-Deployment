module "dev_infra" {
  source = "../../modules/infra"

  environment    = "dev"
  instance_type  = "t3.micro"
  instance_count = 1
  key_name       = "gitops-devops-key"

  admin_cidr = "51.21.224.244/32"
}

output "instance_ips" {
  value = module.dev_infra.instance_ips
}