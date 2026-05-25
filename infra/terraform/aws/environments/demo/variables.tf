# =============================================================================
# Variáveis do ambiente demo
# Valores sensíveis (account_id, etc.) não têm defaults — devem ser
# fornecidos via terraform.tfvars ou variáveis de ambiente TF_VAR_*.
# =============================================================================

variable "aws_region" {
  description = "Região AWS onde o ambiente será provisionado"
  type        = string
}

variable "aws_account_id" {
  description = "ID da conta AWS (sem hífens) — usado em ARNs de políticas IAM"
  type        = string
  sensitive   = true
}

variable "cluster_name" {
  description = "Nome do cluster EKS"
  type        = string
}

variable "environment" {
  description = "Identificador do ambiente (demo, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "Bloco CIDR da VPC"
  type        = string
}

variable "availability_zones" {
  description = "AZs a usar em sa-east-1"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDRs das subnets privadas (uma por AZ)"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDRs das subnets públicas (uma por AZ)"
  type        = list(string)
}

variable "kubernetes_version" {
  description = "Versão do Kubernetes para o cluster EKS"
  type        = string
  default     = "1.29"
}

variable "node_instance_types" {
  description = "Tipos de instância para os worker nodes (mistura favorece disponibilidade Spot)"
  type        = list(string)
  default     = ["m5.xlarge", "m5a.xlarge", "m4.xlarge"]
}

variable "node_min_size" {
  description = "Mínimo de nodes no auto-scaling group"
  type        = number
  default     = 2
}

variable "node_max_size" {
  description = "Máximo de nodes no auto-scaling group"
  type        = number
  default     = 10
}

variable "node_desired_size" {
  description = "Nodes desejados na criação"
  type        = number
  default     = 2
}

variable "github_org" {
  description = "Organização GitHub do repositório (para OIDC trust policy)"
  type        = string
}

variable "github_repo" {
  description = "Nome do repositório GitHub (para OIDC trust policy)"
  type        = string
}

variable "github_branch" {
  description = "Branch autorizada para assume role via OIDC"
  type        = string
  default     = "main"
}

variable "ecr_repositories" {
  description = "Lista de repositórios ECR a criar"
  type        = list(string)
  default     = ["cortex-api", "cortex-worker", "cortex-ingest"]
}

variable "cloudwatch_log_retention_days" {
  description = "Retenção de logs no CloudWatch em dias"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Tags padrão aplicadas a todos os recursos"
  type        = map(string)
  default     = {}
}
