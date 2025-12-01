# Instruções de CI/CD, AWS e Automação para o Projeto ChatIA

Este documento descreve todas as etapas necessárias que o agente Codex deve implementar no projeto para configurar CI/CD, preparar a infraestrutura para deploy em AWS e criar os arquivos complementares no repositório.

---

## 📌 ETAPA 1 — Workflows do GitHub Actions

Crie a pasta:

```
.github/workflows/
```

### 1. `ci.yml`
Responsável por:

- Lint backend  
- Lint frontend  
- Build backend  
- Build frontend  
- Executado em `pull_request` para branches:
  - `staging`
  - `main`

**Função:** validação de código antes do merge.

---

### 2. `build-and-push.yml`
Responsável por:

- Autenticar na AWS via OIDC  
- Construir imagem Docker backend  
- Construir imagem Docker frontend  
- Criar repositórios no ECR caso não existam  
- Realizar push para AWS ECR com tags:
  - `latest`
  - `staging` (branch staging)
  - `production` (branch main)

Executa em push para:

- `staging`
- `main`

---

### 3. `deploy.yml`
Responsável por:

- Atualizar Task Definition do ECS  
- Criar nova revisão da task  
- Iniciar deploy automático  
- Garantir rolling update (zero downtime)

Regras:

- Merge em `staging` → deploy staging  
- Merge em `main` → deploy produção  

---

## 📌 ETAPA 2 — Diretório de Infraestrutura

Crie:

```
infra/
   aws/
      steps.md
      ecr_repositories.txt
      ecs/
         task-backend.json
         task-frontend.json
      load_balancer/
         notes.md
   github/
      notes-secrets.md
```

### Conteúdos obrigatórios:

---

### `steps.md`
Deve conter:

- Criar repositórios ECR backend e frontend  
- Criar cluster ECS  
- Criar Load Balancer  
- Criar serviços ECS (backend + frontend)  
- Criar roles IAM com menor privilégio  

---

### `ecr_repositories.txt`
```
chatia-backend
chatia-frontend
```

---

### `notes-secrets.md`
Secrets necessários no GitHub:

```
AWS_REGION
AWS_ACCOUNT_ID
AWS_ROLE_TO_ASSUME
AWS_ECR_BACKEND
AWS_ECR_FRONTEND
```

Instruções de branches:

```
main → deploy produção
staging → deploy staging
feature/* → PR obrigatório
```

---

## 📌 ETAPA 3 — Ajustes de Docker

### Backend
- Base: python:3.12-slim  
- Expor porta 8000  
- Rodar uvicorn  

### Frontend
- Build Node  
- Servir com Nginx  
- Expor porta 80  

Criar opcionalmente:

```
docker-compose.prod.yml
```

---

## 📌 ETAPA 4 — Task Definitions

Criar arquivos em `infra/aws/ecs/`:

---

### `task-backend.json`
- Porta 8000  
- Logging CloudWatch  
- Fargate compatível  
- Referência ao repositório ECR do backend  

---

### `task-frontend.json`
- Porta 80  
- Logging CloudWatch  
- Fargate compatível  
- Referência ao repositório ECR do frontend  

---

## 📌 ETAPA 5 — Documentação Interna

Gerar:

### `load_balancer/notes.md`
Com orientações de:

- Sub-redes públicas  
- Listener HTTP/HTTPS  
- Regras de roteamento para backend e frontend  

---

### `steps.md` (detalhado)
Com os passos para:

- Criar ECR  
- Criar ECS  
- Criar Load Balancer  
- Criar Roles IAM  

---

### `notes-secrets.md`
Instruções sobre:

- Onde configurar secrets  
- Nomes das variáveis  
- Política de merge  

---

## 📌 ETAPA 6 — Resultado Esperado

O agente deve:

1. Criar **todos os workflows** em `.github/workflows/`
2. Criar toda a pasta **infra/** com documentação e task definitions
3. Atualizar **Dockerfiles** conforme necessário
4. Criar arquivos auxiliares como `docker-compose.prod.yml`
5. Manter o código existente intacto
6. Organizar tudo de forma clara e padronizada

---

# 🚀 Fim das instruções
O repositório estará pronto para CI/CD automático via GitHub Actions e deploy em AWS usando ECR + ECS.
