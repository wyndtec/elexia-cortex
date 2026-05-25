# =============================================================================
# Module: VPC
# Provisiona a rede base do Elexia Cortex em sa-east-1.
# Usa o módulo oficial da AWS para garantir boas práticas de subnets.
# =============================================================================

terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs = var.availability_zones

  # Subnets privadas: onde rodam os worker nodes do EKS (sem IP público)
  private_subnets = var.private_subnet_cidrs

  # Subnets públicas: usadas pelo NAT Gateway e pelo Load Balancer do Ingress
  public_subnets = var.public_subnet_cidrs

  # NAT Gateway: single=true reduz custo em demo; false = HA por AZ em prod
  enable_nat_gateway   = true
  single_nat_gateway   = var.single_nat_gateway
  enable_dns_hostnames = true
  enable_dns_support   = true

  # Tags obrigatórias para que o EKS descubra as subnets automaticamente
  # via cloud-controller-manager
  public_subnet_tags = {
    "kubernetes.io/role/elb"                    = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"           = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }

  tags = var.tags
}
