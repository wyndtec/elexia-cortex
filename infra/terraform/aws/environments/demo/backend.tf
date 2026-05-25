# =============================================================================
# Terraform State: S3 + DynamoDB lock
# O bucket S3 e a tabela DynamoDB devem ser criados manualmente antes do
# primeiro `terraform init`. Eles não podem ser gerenciados pelo próprio estado.
#
# Pré-requisitos manuais (uma vez por conta AWS):
#   aws s3api create-bucket \
#     --bucket elexia-cortex-terraform-state \
#     --region sa-east-1 \
#     --create-bucket-configuration LocationConstraint=sa-east-1
#
#   aws s3api put-bucket-versioning \
#     --bucket elexia-cortex-terraform-state \
#     --versioning-configuration Status=Enabled
#
#   aws dynamodb create-table \
#     --table-name elexia-cortex-terraform-lock \
#     --attribute-definitions AttributeName=LockID,AttributeType=S \
#     --key-schema AttributeName=LockID,KeyType=HASH \
#     --billing-mode PAY_PER_REQUEST \
#     --region sa-east-1
# =============================================================================

terraform {
  backend "s3" {
    bucket         = "elexia-cortex-terraform-state"
    key            = "environments/demo/terraform.tfstate"
    region         = "sa-east-1"
    encrypt        = true

    # DynamoDB para lock — previne apply concorrentes (state corruption)
    dynamodb_table = "elexia-cortex-terraform-lock"
  }
}
