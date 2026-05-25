# =============================================================================
# Module: EKS
# Provisiona o cluster EKS v1.29+ com managed node groups.
# Usa Spot Instances para redução de custo no ambiente de demo.
# IRSA (IAM Roles for Service Accounts) habilitado para autenticação granular.
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

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.8.4"

  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version

  # Subnets privadas: worker nodes não expõem IP público
  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  # Endpoint privado: kubectl só funciona dentro da VPC ou via VPN/bastion
  # Endpoint público habilitado para CI/CD via OIDC (GitHub Actions)
  # SECURITY NOTE: cluster_endpoint_public_access_cidrs restringe quais IPs podem
  # acessar o API server público. Default ["0.0.0.0/0"] em demo; restringir em prod
  # para os IPs do escritório/VPN + range do GitHub Actions (meta.github.com/meta).
  cluster_endpoint_private_access      = true
  cluster_endpoint_public_access       = var.cluster_endpoint_public_access
  cluster_endpoint_public_access_cidrs = var.cluster_endpoint_public_access_cidrs

  # IRSA: permite que pods assumam roles IAM via service accounts
  # Necessário para serviços como ALB Controller, ExternalDNS, etc.
  enable_irsa = true

  # IAM roles pré-criadas pelo módulo iam/
  iam_role_arn = var.eks_cluster_role_arn

  # Add-ons gerenciados pela AWS: mantidos atualizados automaticamente
  cluster_addons = {
    coredns = {
      resolve_conflicts = "OVERWRITE"
    }
    kube-proxy = {
      resolve_conflicts = "OVERWRITE"
    }
    vpc-cni = {
      resolve_conflicts = "OVERWRITE"
    }
    aws-ebs-csi-driver = {
      resolve_conflicts = "OVERWRITE"
    }
  }

  # CloudWatch Logging: habilita logs de control plane com retenção de 30 dias
  # Tipos habilitados: api, audit, authenticator, controllerManager, scheduler
  cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  create_cloudwatch_log_group            = true
  cloudwatch_log_group_retention_in_days = var.cloudwatch_log_retention_days
  cloudwatch_log_group_kms_key_id        = var.cloudwatch_kms_key_id # opcional

  # Node Groups gerenciados: AWS gerencia o ciclo de vida dos nodes
  eks_managed_node_groups = {
    # Node group principal usando Spot Instances para economia em demo
    # Spot pode ser interrompido com 2 min de aviso — adequado para demo
    cortex_spot = {
      name = "${var.cluster_name}-spot"

      # Mistura de tipos de instância aumenta disponibilidade de Spot
      instance_types = var.node_instance_types
      capacity_type  = "SPOT"

      min_size     = var.node_min_size
      max_size     = var.node_max_size
      desired_size = var.node_desired_size

      # Nodes rodam em subnets privadas
      subnet_ids = var.private_subnet_ids

      iam_role_arn = var.eks_node_role_arn

      # Atualização rolling: máximo 1 node indisponível por vez
      update_config = {
        max_unavailable = 1
      }

      labels = {
        role        = "worker"
        environment = var.environment
        capacity    = "spot"
      }

      tags = var.tags
    }
  }

  # Acesso ao cluster: permite que o usuário que criou via Terraform gerencie
  # Adicione outros usuários/roles conforme necessário
  access_entries = var.cluster_access_entries

  tags = var.tags
}

# =============================================================================
# CloudWatch Log Group adicional para logs de aplicação (fora do control plane)
# Caminho: /cortex/eks/{cluster_name}
# =============================================================================
resource "aws_cloudwatch_log_group" "cortex_eks" {
  name              = "/cortex/eks/${var.cluster_name}"
  retention_in_days = var.cloudwatch_log_retention_days

  tags = var.tags
}
