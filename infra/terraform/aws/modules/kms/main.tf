terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

locals {
  tags = {
    Project     = "elexia-cortex"
    Environment = var.environment
    ManagedBy   = "terraform"
    Component   = "kms"
  }
}

# Customer Managed Key — criptografia em repouso para todos os recursos do Cortex
resource "aws_kms_key" "cortex" {
  description             = "Elexia Cortex CMK — ${var.environment} (EBS, S3, Vault auto-unseal)"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  multi_region            = false

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Root account tem acesso total (necessário para administração da chave)
      {
        Sid    = "AllowRootAccount"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.aws_account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      # EKS Node Role — permite que os nodes criptografem/descriptografem volumes EBS
      {
        Sid    = "AllowEKSNodeEncryption"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.aws_account_id}:role/${var.cluster_name}-node-role"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey",
          "kms:CreateGrant",
        ]
        Resource = "*"
      },
      # Vault auto-unseal — ServiceAccount via IRSA assume role que pode usar esta chave
      {
        Sid    = "AllowVaultAutoUnseal"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.aws_account_id}:role/${var.cluster_name}-vault-unseal-role"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:DescribeKey",
        ]
        Resource = "*"
      },
      # GitHub Actions OIDC role — leitura + grants para Terraform plan/apply
      # Ações destrutivas (Delete*, Disable*, ScheduleKeyDeletion) são EXCLUÍDAS
      # por princípio de menor privilégio: CI/CD NÃO deve poder deletar a CMK.
      {
        Sid    = "AllowGitHubActionsIaC"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.aws_account_id}:role/${var.cluster_name}-github-actions-role"
        }
        Action = [
          "kms:CreateGrant",
          "kms:DescribeKey",
          "kms:ListAliases",
          "kms:ListGrants",
          "kms:ListKeyPolicies",
          "kms:ListKeys",
          "kms:GetKeyPolicy",
          "kms:GetKeyRotationStatus",
          "kms:TagResource",
          "kms:UntagResource",
        ]
        Resource = "*"
      },
    ]
  })

  tags = local.tags
}

resource "aws_kms_alias" "cortex" {
  name          = "alias/elexia-cortex-${var.environment}"
  target_key_id = aws_kms_key.cortex.key_id
}

# IAM Role para Vault auto-unseal via IRSA
resource "aws_iam_role" "vault_unseal" {
  name = "${var.cluster_name}-vault-unseal-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.aws_account_id}:oidc-provider/oidc.eks.sa-east-1.amazonaws.com/id/${var.oidc_provider_id}"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "oidc.eks.sa-east-1.amazonaws.com/id/${var.oidc_provider_id}:sub" = "system:serviceaccount:${var.vault_namespace}:vault"
            "oidc.eks.sa-east-1.amazonaws.com/id/${var.oidc_provider_id}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy" "vault_unseal" {
  name = "vault-kms-unseal"
  role = aws_iam_role.vault_unseal.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:DescribeKey",
        ]
        Resource = aws_kms_key.cortex.arn
      }
    ]
  })
}
