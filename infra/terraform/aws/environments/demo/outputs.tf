output "vpc_id" {
  description = "ID da VPC do ambiente demo"
  value       = module.vpc.vpc_id
}

output "cluster_name" {
  description = "Nome do cluster EKS"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint do API server do cluster EKS"
  value       = module.eks.cluster_endpoint
}

output "cluster_oidc_issuer_url" {
  description = "URL OIDC do cluster — necessário para configurar IRSA por serviço"
  value       = module.eks.cluster_oidc_issuer_url
}

output "github_actions_role_arn" {
  description = "ARN da role para GitHub Actions — usar em aws-actions/configure-aws-credentials"
  value       = module.iam.github_actions_role_arn
}

output "ecr_repository_urls" {
  description = "URLs dos repositórios ECR criados"
  value       = module.ecr.repository_urls
}

output "cloudwatch_log_group" {
  description = "Nome do CloudWatch Log Group para logs de aplicação"
  value       = module.eks.cloudwatch_log_group_name
}

# Kubeconfig: redirecionar com: terraform output -raw kubeconfig > ~/.kube/config
# AC7: kubeconfig gerado como Terraform output
output "kubeconfig" {
  description = "Kubeconfig para acessar o cluster via kubectl"
  value       = module.eks.kubeconfig
  sensitive   = true
}
