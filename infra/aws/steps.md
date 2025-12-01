# Passo a passo AWS (ECR, ECS, ALB, IAM)

1) **Repositorios ECR**
   - Criar `chatia-backend` e `chatia-frontend` (ver `infra/aws/ecr_repositories.txt`).
   - Habilitar scan on push e opcionalmente criptografia KMS.

2) **Roles IAM de execucao e task**
   - Execution role Fargate com politicas gerenciadas: `AmazonECSTaskExecutionRolePolicy`, `CloudWatchLogsFullAccess` (ou politica minima para `logs:CreateLogGroup/Stream` e `logs:PutLogEvents`), `AmazonEC2ContainerRegistryReadOnly`.
   - Task role minimalista apenas se o container precisar de outros servicos (ex.: SSM Parameter Store ou Secrets Manager). Caso contrario, manter sem permissoes adicionais.

3) **Cluster ECS**
   - Criar cluster Fargate (ex.: `chatia-cluster`) na mesma VPC onde ficara o ALB.

4) **Networking**
   - VPC com pelo menos duas sub-redes publicas para o ALB e duas privadas para as tasks Fargate.
   - Security groups: um para o ALB (permitindo 80/443 publico) e um para as tasks permitindo apenas trafego vindo do SG do ALB.

5) **Load Balancer**
   - Criar Application Load Balancer publico com listeners 80 (HTTP) e, se houver TLS, 443 (HTTPS) com certificado ACM.
   - Criar dois target groups (IP target type, protocolo HTTP): `chatia-backend-tg` porta 8000 e `chatia-frontend-tg` porta 80.
   - Adicionar health checks (`/health` para backend; `/` para frontend).

6) **Services ECS**
   - Backend: service Fargate apontando para o target group `chatia-backend-tg`, porta 8000, minimo 1 desired task. Enable execute command opcional.
   - Frontend: service Fargate apontando para `chatia-frontend-tg`, porta 80.
   - Ativar deployment type Rolling update com `minimumHealthyPercent=100` e `maximumPercent=200` para zero downtime.
   - Associar security group das tasks e sub-redes privadas com NAT Gateway.

7) **Task definitions**
   - Atualizar `infra/aws/ecs/task-backend.json` e `infra/aws/ecs/task-frontend.json` com ARNs reais (`executionRoleArn`, `taskRoleArn`) e regiao nos logs.
   - Definir variaveis sensiveis via Secrets Manager/SSM e referencia-las nas definicoes se necessario.

8) **GitHub Actions**
   - Criar secrets `AWS_REGION`, `AWS_ACCOUNT_ID`, `AWS_ROLE_TO_ASSUME`, `AWS_ECR_BACKEND`, `AWS_ECR_FRONTEND`.
   - Criar GitHub Variables `ECS_CLUSTER`, `ECS_SERVICE_BACKEND`, `ECS_SERVICE_FRONTEND`.
   - Opcional: usar Environments (staging/production) para isolar secrets/vars e revisar deploys manuais.

9) **Rotas e DNS**
   - Criar entradas DNS (Route 53) apontando para o ALB. Usar regras do listener para encaminhar `/api/*` para backend e `/` para frontend, se quiser URL unica.

10) **Observabilidade**
    - Confirmar criacao dos log groups indicados nos arquivos de task definition.
    - Habilitar metricas do ALB e auto scaling (CPU/Mem) para os services conforme carga esperada.
