output "eks_cluster_role_arn" {
  description = "ARN da role do control plane EKS"
  value       = aws_iam_role.eks_cluster_role.arn
}

output "eks_node_role_arn" {
  description = "ARN da role dos worker nodes EKS"
  value       = aws_iam_role.eks_node_role.arn
}

output "github_actions_role_arn" {
  description = "ARN da role para GitHub Actions via OIDC — usar em aws-actions/configure-aws-credentials"
  value       = aws_iam_role.github_actions_role.arn
}

output "github_oidc_provider_arn" {
  description = "ARN do OIDC provider do GitHub Actions"
  value       = aws_iam_openid_connect_provider.github_actions.arn
}
