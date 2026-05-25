output "repository_urls" {
  description = "Mapa de nome → URL dos repositórios ECR criados"
  value       = { for k, v in aws_ecr_repository.cortex_services : k => v.repository_url }
}

output "repository_arns" {
  description = "Mapa de nome → ARN dos repositórios ECR criados"
  value       = { for k, v in aws_ecr_repository.cortex_services : k => v.arn }
}
