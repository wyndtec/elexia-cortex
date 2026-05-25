variable "aws_account_id" {
  description = "AWS Account ID — usado nas KMS key policies"
  type        = string
  sensitive   = true
}

variable "cluster_name" {
  description = "Nome do cluster EKS — usado para referenciar roles IAM existentes"
  type        = string
}

variable "environment" {
  description = "Ambiente de deployment (demo, staging, prod)"
  type        = string
  default     = "demo"

  validation {
    condition     = contains(["demo", "staging", "prod"], var.environment)
    error_message = "environment deve ser demo, staging ou prod."
  }
}

variable "vault_namespace" {
  description = "Namespace Kubernetes onde o Vault será instalado"
  type        = string
  default     = "cortex-infra"
}

variable "oidc_provider_id" {
  description = "ID do OIDC provider do cluster EKS (parte final da URL do issuer)"
  type        = string
}
