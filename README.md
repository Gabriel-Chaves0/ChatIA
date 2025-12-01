# Assistente Educacional (FastAPI + React)

Aplicação composta por um backend FastAPI e um frontend React (Vite + TypeScript), ambos prontos para containerização com Docker.

## Estrutura
- `backend/` – API FastAPI com endpoints `/health` e `/chat`
- `frontend/` – SPA em React com páginas de Chat e Configurações
- `docker-compose.yml` – Orquestra os dois serviços

## Backend: rodando local
1) Instale o `uv` (gerenciador rápido de Python):  
   ```bash
   pip install uv
   ```
2) Sincronize dependências (cria venv automático em `.venv`):  
   ```bash
   cd backend
   uv sync
   ```
3) Configurar variáveis em `backend/.env`:
   ```
   # Gemini
   GEMINI_API_KEY=<sua-chave-gemini>
   GEMINI_MODEL=gemini-2.5-flash
   GEMINI_API_VERSION=v1beta
   GEMINI_API_BASE=https://generativelanguage.googleapis.com

   # CORS
   ALLOWED_ORIGINS=http://localhost:5173
   ```
   - Validação do cabeçalho `X-API-Key`: se existir `GEMINI_API_KEY`, o valor precisa corresponder a ela. Se `GEMINI_API_KEY` ficar vazia, a validação é ignorada e o backend volta ao mock (`resposta do assistente`).
4) Iniciar a API (usando o Python da venv gerada pelo uv):
   ```bash
   uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
   - Health check: `GET http://localhost:8000/health`
   - Chat: `POST http://localhost:8000/chat` com header `X-API-Key`

## Frontend: rodando local
1) Instalar dependências:
   ```bash
   cd frontend
   npm install
   ```
2) Ajustar `frontend/.env` se quiser alterar a URL da API:
   ```
   VITE_API_URL=http://localhost:8000
   ```
3) Rodar em modo dev:
   ```bash
   npm run dev -- --host --port 5173
   ```
4) Na página "Configurações", salve a chave de API. Ela é enviada como `X-API-Key` em cada chamada ao backend.

## Docker
1) Build e start:
   ```bash
   docker compose build
   docker compose up
   ```
2) Serviços:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173

O backend lê a configuração do arquivo `backend/.env` no container. O frontend injeta `VITE_API_URL` no build (copiado de `frontend/.env`).

## Anotações rápidas
- Endpoint `/chat` chama a API de Chat Completions (OpenAI) usando `LLM_API_KEY`. Sem chave, cai no mock: `{"reply": "resposta do assistente", "used_model": "mock-educational-model"}`.
- O frontend guarda a API key em `localStorage` (chave `edu-assistant-api-key`).
- CORS liberado para `http://localhost:5173` por padrão.
