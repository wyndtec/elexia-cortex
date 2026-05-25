output "vpc_id" {
  description = "ID da VPC criada"
  value       = module.vpc.vpc_id
}

output "private_subnet_ids" {
  description = "IDs das subnets privadas (usadas pelos worker nodes do EKS)"
  value       = module.vpc.private_subnets
}

output "public_subnet_ids" {
  description = "IDs das subnets públicas (usadas pelo Load Balancer do Ingress)"
  value       = module.vpc.public_subnets
}

output "vpc_cidr_block" {
  description = "Bloco CIDR da VPC"
  value       = module.vpc.vpc_cidr_block
}
