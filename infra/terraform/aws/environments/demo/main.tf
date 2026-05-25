# =============================================================================
# Environment: Demo
# Orquestra os módulos VPC, IAM, EKS e ECR para o ambiente de demonstração.
# Região: sa-east-1 (São Paulo)
# =============================================================================

terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

# Provider kubernetes: configurado com os outputs do módulo EKS
# O token é renovado automaticamente via exec (aws eks get-token)
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", var.cluster_name]
  }
}

# =============================================================================
# Módulo: VPC
# =============================================================================
module "vpc" {
  source = "../../modules/vpc"

  vpc_name             = "${var.cluster_name}-vpc"
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  private_subnet_cidrs = var.private_subnet_cidrs
  public_subnet_cidrs  = var.public_subnet_cidrs
  cluster_name         = var.cluster_name

  # Single NAT Gateway: reduz custo em demo (sacrifica HA de rede)
  single_nat_gateway = true

  tags = var.tags
}

# =============================================================================
# Módulo: IAM
# =============================================================================
module "iam" {
  source = "../../modules/iam"

  cluster_name   = var.cluster_name
  aws_region     = var.aws_region
  aws_account_id = var.aws_account_id
  github_org     = var.github_org
  github_repo    = var.github_repo
  github_branch  = var.github_branch

  tags = var.tags
}

# =============================================================================
# Módulo: EKS
# Depende de VPC e IAM
# =============================================================================
module "eks" {
  source = "../../modules/eks"

  cluster_name       = var.cluster_name
  kubernetes_version = var.kubernetes_version
  environment        = var.environment

  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids

  eks_cluster_role_arn = module.iam.eks_cluster_role_arn
  eks_node_role_arn    = module.iam.eks_node_role_arn

  node_instance_types = var.node_instance_types
  node_min_size       = var.node_min_size
  node_max_size       = var.node_max_size
  node_desired_size   = var.node_desired_size

  cloudwatch_log_retention_days = var.cloudwatch_log_retention_days

  # Endpoint público necessário para GitHub Actions (OIDC) fazer kubectl apply
  cluster_endpoint_public_access = true

  tags = var.tags

  depends_on = [module.vpc, module.iam]
}

# =============================================================================
# Módulo: ECR
# =============================================================================
module "ecr" {
  source = "../../modules/ecr"

  repositories    = var.ecr_repositories
  max_image_count = 20

  tags = var.tags
}
