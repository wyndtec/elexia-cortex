variable "vpc_name" {
  description = "Nome da VPC — usado para identificação e tagging"
  type        = string
}

variable "vpc_cidr" {
  description = "Bloco CIDR principal da VPC (ex: 10.0.0.0/16)"
  type        = string
}

variable "availability_zones" {
  description = "Lista de AZs a usar (ex: [\"sa-east-1a\", \"sa-east-1b\", \"sa-east-1c\"])"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDRs para subnets privadas (uma por AZ)"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDRs para subnets públicas (uma por AZ)"
  type        = list(string)
}

variable "cluster_name" {
  description = "Nome do cluster EKS — usado nas tags de descoberta de subnets"
  type        = string
}

variable "single_nat_gateway" {
  description = "true = 1 NAT Gateway (reduz custo em demo); false = 1 por AZ (HA prod)"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Mapa de tags aplicadas a todos os recursos da VPC"
  type        = map(string)
  default     = {}
}
