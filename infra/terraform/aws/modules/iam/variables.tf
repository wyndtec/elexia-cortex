variable "cluster_name" {
  description = "Nome do cluster EKS — usado para nomear as roles"
  type        = string
}

variable "aws_region" {
  description = "Região AWS (ex: sa-east-1)"
  type        = string
}

variable "aws_account_id" {
  description = "ID da conta AWS — usado no ARN do recurso EKS na política IAM"
  type        = string
  sensitive   = true
}

variable "github_org" {
  description = "Organização ou usuário GitHub do repositório (ex: elexia-ai)"
  type        = string
}

variable "github_repo" {
  description = "Nome do repositório GitHub (ex: elexia-cortex)"
  type        = string
}

variable "github_branch" {
  description = "Branch autorizada para assume role via OIDC (ex: main)"
  type        = string
  default     = "main"
}

variable "tags" {
  description = "Mapa de tags aplicadas a todos os recursos IAM"
  type        = map(string)
  default     = {}
}
