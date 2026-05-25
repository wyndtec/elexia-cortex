# =============================================================================
# Module: IAM
# Cria as roles mínimas necessárias para o cluster EKS e IRSA.
# Segue o princípio de menor privilégio — sem AdministratorAccess.
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

# -----------------------------------------------------------------------------
# Role para o control plane do EKS
# O serviço eks.amazonaws.com precisa desta role para gerenciar o cluster.
# -----------------------------------------------------------------------------
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.cluster_name}-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# -----------------------------------------------------------------------------
# Role para os worker nodes (Node Group)
# Permissions mínimas para que os nodes possam registrar no cluster e
# puxar imagens do ECR.
# -----------------------------------------------------------------------------
resource "aws_iam_role" "eks_node_role" {
  name = "${var.cluster_name}-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# CloudWatch: permissão apenas para enviar logs (sem leitura de outros logs)
resource "aws_iam_role_policy_attachment" "cloudwatch_agent_policy" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
  role       = aws_iam_role.eks_node_role.name
}

# -----------------------------------------------------------------------------
# Role para GitHub Actions via OIDC (sem long-lived credentials)
# Permite que o workflow CI/CD da branch main faça deploy no EKS e ECR.
# -----------------------------------------------------------------------------
resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  # Thumbprint do certificado TLS do GitHub Actions OIDC endpoint
  # Valor fixo conforme documentação da AWS (verificado em 2024)
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  client_id_list = ["sts.amazonaws.com"]

  tags = var.tags
}

resource "aws_iam_role" "github_actions_role" {
  name = "${var.cluster_name}-github-actions-role"

  # Trust policy: só permite tokens do repositório e branch configurados
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github_actions.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            # Restringe ao repositório e branch específicos
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/${var.github_branch}"
          }
        }
      }
    ]
  })

  tags = var.tags
}

# Política customizada: apenas operações necessárias para CI/CD
resource "aws_iam_policy" "github_actions_policy" {
  name        = "${var.cluster_name}-github-actions-policy"
  description = "Permissões mínimas para GitHub Actions: ECR push + EKS deploy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # ecr:GetAuthorizationToken exige Resource "*" obrigatoriamente (não aceita ARN de repositório)
        Sid    = "ECRAuthToken"
        Effect = "Allow"
        Action = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      },
      {
        # ECR: operações de push/pull restritas aos repositórios do projeto (cortex-*)
        # Evita que credenciais comprometidas façam push em outros repositórios da conta
        Sid    = "ECRPush"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages"
        ]
        Resource = "arn:aws:ecr:${var.aws_region}:${var.aws_account_id}:repository/cortex-*"
      },
      {
        # EKS: apenas descrever e atualizar kubeconfig (kubectl apply via kubeconfig)
        Sid    = "EKSDescribe"
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]
        Resource = "arn:aws:eks:${var.aws_region}:${var.aws_account_id}:cluster/${var.cluster_name}"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "github_actions_policy_attachment" {
  policy_arn = aws_iam_policy.github_actions_policy.arn
  role       = aws_iam_role.github_actions_role.name
}
