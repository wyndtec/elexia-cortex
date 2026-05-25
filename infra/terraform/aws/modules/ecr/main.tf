# =============================================================================
# Module: ECR
# Cria os repositórios de imagens Docker para os serviços do Elexia Cortex.
# Lifecycle policy: mantém apenas as últimas N imagens para controle de custo.
# =============================================================================

terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_ecr_repository" "cortex_services" {
  # Cria um repositório por serviço declarado em var.repositories
  for_each = toset(var.repositories)

  name                 = each.value
  image_tag_mutability = "MUTABLE"

  # Scan on push: detecta vulnerabilidades conhecidas automaticamente
  image_scanning_configuration {
    scan_on_push = true
  }

  # Encrypts images at rest com a chave padrão da AWS (sem custo adicional)
  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = var.tags
}

# Lifecycle policy: remove imagens sem tag há mais de 30 dias,
# mantém apenas as últimas ${var.max_image_count} imagens com tag.
resource "aws_ecr_lifecycle_policy" "cortex_services" {
  for_each   = aws_ecr_repository.cortex_services
  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Remover imagens sem tag após 30 dias"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 30
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Manter apenas as últimas ${var.max_image_count} imagens com tag"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v", "sha-", "latest"]
          countType     = "imageCountMoreThan"
          countNumber   = var.max_image_count
        }
        action = { type = "expire" }
      }
    ]
  })
}
