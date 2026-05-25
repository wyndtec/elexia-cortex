variable "cluster_name" {
  description = "Nome do cluster EKS"
  type        = string
}

variable "kubernetes_version" {
  description = "Versão do Kubernetes para o cluster EKS (ex: \"1.29\")"
  type        = string
  default     = "1.29"
}

variable "vpc_id" {
  description = "ID da VPC onde o cluster será criado"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs das subnets privadas para os worker nodes"
  type        = list(string)
}

variable "eks_cluster_role_arn" {
  description = "ARN da IAM role do control plane EKS"
  type        = string
}

variable "eks_node_role_arn" {
  description = "ARN da IAM role dos worker nodes"
  type        = string
}

variable "cluster_endpoint_public_access" {
  description = "Habilita endpoint público do API server (necessário para CI/CD via OIDC)"
  type        = bool
  default     = true
}

variable "node_instance_types" {
  description = "Lista de tipos de instância para o node group (mistura aumenta disponibilidade Spot)"
  type        = list(string)
  default     = ["m5.xlarge", "m5a.xlarge", "m4.xlarge"]
}

variable "node_min_size" {
  description = "Número mínimo de nodes no auto-scaling group"
  type        = number
  default     = 2
}

variable "node_max_size" {
  description = "Número máximo de nodes no auto-scaling group"
  type        = number
  default     = 10
}

variable "node_desired_size" {
  description = "Número desejado de nodes na criação"
  type        = number
  default     = 2
}

variable "cloudwatch_log_retention_days" {
  description = "Retenção dos logs no CloudWatch em dias"
  type        = number
  default     = 30
}

variable "cloudwatch_kms_key_id" {
  description = "KMS Key ARN para criptografar logs do CloudWatch (opcional; deixar null para usar chave AWS padrão)"
  type        = string
  default     = null
}

variable "environment" {
  description = "Ambiente de execução (demo, prod)"
  type        = string
}

variable "cluster_access_entries" {
  description = "Mapa de entradas de acesso ao cluster (usuários/roles IAM que podem usar kubectl)"
  type        = any
  default     = {}
}

variable "tags" {
  description = "Mapa de tags aplicadas a todos os recursos EKS"
  type        = map(string)
  default     = {}
}
