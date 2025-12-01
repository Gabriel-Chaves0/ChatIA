from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChatRequest, ChatResponse
from app.services.llm_client import generate_reply
from app.settings import settings


app = FastAPI(title="Educational Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, x_api_key: str = Header(..., alias="X-API-Key")) -> ChatResponse:
    # Validate against GEMINI_API_KEY when set; if empty, skip validation.
    allowed_keys = [k for k in (settings.gemini_api_key,) if k]
    if allowed_keys and x_api_key not in allowed_keys:
        raise HTTPException(status_code=401, detail="Invalid API key")

    response = await generate_reply(payload.messages, payload.subject)
    return response
