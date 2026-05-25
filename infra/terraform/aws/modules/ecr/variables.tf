variable "repositories" {
  description = "Lista de nomes de repositórios ECR a criar (ex: [\"cortex-api\", \"cortex-worker\"])"
  type        = list(string)
}

variable "max_image_count" {
  description = "Número máximo de imagens com tag a manter por repositório"
  type        = number
  default     = 20
}

variable "tags" {
  description = "Mapa de tags aplicadas a todos os repositórios ECR"
  type        = map(string)
  default     = {}
}
