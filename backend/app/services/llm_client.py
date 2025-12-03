from typing import List

import httpx
from fastapi import HTTPException

from app.schemas import Message, ChatResponse
from app.settings import settings


def _messages_to_gemini_contents(messages: List[Message], subject: str | None = None) -> list[dict]:
    """Convert chat messages into Gemini 'contents' format."""
    contents: list[dict] = []
    if subject:
        contents.append(
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            f"Voce e uma profissional chamada Chatia especialista no assunto: {subject}. "
                            "Responda de forma organizada, precisa e segura, como um expert. "
                            "As respostas devem ser em texto corrido, sem listas ou marcadores. "
                            "Sempre gere uma pergunta de seguimento para manter a conversa fluindo. "
                            "E no final de toda mensagem cite uma curiosidade interessante relacionada ao assunto. "
                            "Se a pergunta nao tiver relacao com o assunto, recuse educadamente e oriente a manter o foco."
                        )
                    }
                ],
            }
        )
    for msg in messages:
        contents.append(
            {
                "role": "user" if msg.role == "user" else "model",
                "parts": [{"text": msg.content}],
            }
        )
    return contents


async def _call_gemini(messages: List[Message], subject: str | None = None) -> ChatResponse:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY nao configurada.")

    endpoint = (
        f"{settings.gemini_api_base}/{settings.gemini_api_version}/models/{settings.gemini_model}:generateContent"
        f"?key={settings.gemini_api_key}"
    )
    body = {"contents": _messages_to_gemini_contents(messages, subject), "generationConfig": {"temperature": 0.7}}

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(endpoint, json=body)
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates") or []
        if not candidates:
            raise HTTPException(status_code=502, detail="LLM provider returned no candidates.")
        reply_text = candidates[0]["content"]["parts"][0]["text"]
        used_model = data.get("model", settings.gemini_model)
        return ChatResponse(reply=reply_text, used_model=used_model)
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text
        raise HTTPException(status_code=502, detail=f"LLM provider error: {exc.response.status_code} {detail}")
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Erro ao comunicar com LLM: {exc}")


async def generate_reply(messages: List[Message], subject: str | None = None) -> ChatResponse:
    """
    Uses Gemini. If no Gemini key is set, falls back to mock response.
    """
    if not settings.gemini_api_key:
        reply_text = "resposta do assistente" if not subject else f"resposta do assistente sobre {subject}"
        return ChatResponse(reply=reply_text, used_model="mock-educational-model")

    return await _call_gemini(messages, subject)
