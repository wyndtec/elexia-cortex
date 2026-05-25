output "kms_key_id" {
  description = "ID da CMK — usar para referenciar a chave em outros módulos"
  value       = aws_kms_key.cortex.key_id
}

output "kms_key_arn" {
  description = "ARN da CMK — usar em políticas IAM e configurações de serviços"
  value       = aws_kms_key.cortex.arn
}

output "kms_alias_arn" {
  description = "ARN do alias da CMK — usar na configuração de auto-unseal do Vault"
  value       = aws_kms_alias.cortex.arn
}

output "vault_unseal_role_arn" {
  description = "ARN da IAM Role para Vault auto-unseal via IRSA"
  value       = aws_iam_role.vault_unseal.arn
}
