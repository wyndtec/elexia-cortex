# =============================================================================
# Valores do ambiente demo — sa-east-1
# Variáveis sensíveis (aws_account_id) devem ser passadas via:
#   export TF_VAR_aws_account_id="123456789012"
# ou via arquivo .auto.tfvars não versionado.
#
# NUNCA commitar aws_account_id ou credenciais neste arquivo.
# =============================================================================

aws_region   = "sa-east-1"
cluster_name = "elexia-cortex-demo"
environment  = "demo"

# Rede: sa-east-1 tem 3 AZs disponíveis
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["sa-east-1a", "sa-east-1b", "sa-east-1c"]

# Subnets privadas: /20 = 4094 IPs por AZ (suficiente para pods EKS)
private_subnet_cidrs = ["10.0.0.0/20", "10.0.16.0/20", "10.0.32.0/20"]

# Subnets públicas: /24 = 254 IPs (suficiente para Load Balancers e NAT)
public_subnet_cidrs = ["10.0.100.0/24", "10.0.101.0/24", "10.0.102.0/24"]

# EKS
kubernetes_version = "1.29"

# Node group: Spot Instances com mix de tipos para maior disponibilidade
node_instance_types = ["m5.xlarge", "m5a.xlarge", "m4.xlarge"]
node_min_size       = 2
node_max_size       = 10
node_desired_size   = 2

# GitHub Actions OIDC — ajuste org/repo para o repositório real
github_org    = "elexia-ai"
github_repo   = "elexia-cortex"
github_branch = "main"

# ECR: repositórios iniciais da plataforma
ecr_repositories = [
  "cortex-api",
  "cortex-worker",
  "cortex-ingest",
  "cortex-gateway"
]

# CloudWatch
cloudwatch_log_retention_days = 30

# Tags padrão para todos os recursos
tags = {
  Project     = "elexia-cortex"
  Environment = "demo"
  ManagedBy   = "terraform"
  Team        = "platform"
}
