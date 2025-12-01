# Secrets e variaveis no GitHub

Secrets obrigatorios (repositorio ou environments):
- `AWS_REGION`
- `AWS_ACCOUNT_ID`
- `AWS_ROLE_TO_ASSUME`
- `AWS_ECR_BACKEND`
- `AWS_ECR_FRONTEND`

Variaveis recomendadas (GitHub Variables ou Environment Vars):
- `ECS_CLUSTER`
- `ECS_SERVICE_BACKEND`
- `ECS_SERVICE_FRONTEND`

Politica de branches:
- `main` -> deploy producao
- `staging` -> deploy staging
- `feature/*` -> PR obrigatorio

Orientacoes:
- Usar OIDC com `AWS_ROLE_TO_ASSUME` para evitar chaves long-lived.
- Se usar Environments (`staging`, `production`), duplicar secrets/vars por ambiente e ativar reviewers se desejado.
- Manter a role com menor privilegio: permissao de push no ECR e atualizacao de services ECS/CloudWatch Logs apenas para os recursos deste projeto.
