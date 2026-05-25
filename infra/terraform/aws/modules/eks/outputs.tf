output "cluster_id" {
  description = "ID do cluster EKS"
  value       = module.eks.cluster_id
}

output "cluster_name" {
  description = "Nome do cluster EKS"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint do API server do cluster EKS"
  value       = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  description = "Certificado CA do cluster (base64) — usado para gerar kubeconfig"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

output "cluster_oidc_issuer_url" {
  description = "URL do OIDC issuer do cluster — necessário para configurar IRSA"
  value       = module.eks.cluster_oidc_issuer_url
}

output "oidc_provider_arn" {
  description = "ARN do OIDC provider do cluster — necessário para IRSA"
  value       = module.eks.oidc_provider_arn
}

output "cloudwatch_log_group_name" {
  description = "Nome do CloudWatch Log Group para logs de aplicação"
  value       = aws_cloudwatch_log_group.cortex_eks.name
}

# Kubeconfig gerado como output para uso imediato (AC7)
# Redirecione com: terraform output -raw kubeconfig > ~/.kube/config
output "kubeconfig" {
  description = "Kubeconfig para acessar o cluster via kubectl"
  sensitive   = true
  value       = <<-EOT
    apiVersion: v1
    kind: Config
    clusters:
    - cluster:
        server: ${module.eks.cluster_endpoint}
        certificate-authority-data: ${module.eks.cluster_certificate_authority_data}
      name: ${module.eks.cluster_name}
    contexts:
    - context:
        cluster: ${module.eks.cluster_name}
        user: ${module.eks.cluster_name}
      name: ${module.eks.cluster_name}
    current-context: ${module.eks.cluster_name}
    users:
    - name: ${module.eks.cluster_name}
      user:
        exec:
          apiVersion: client.authentication.k8s.io/v1beta1
          command: aws
          args:
            - eks
            - get-token
            - --cluster-name
            - ${module.eks.cluster_name}
          env: null
          interactiveMode: IfAvailable
  EOT
}
