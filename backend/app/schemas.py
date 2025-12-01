from typing import List, Optional

from pydantic import BaseModel, Field


class Message(BaseModel):
    role: str = Field(..., description="Role of the author, e.g. user or assistant")
    content: str = Field(..., description="Content of the message")


class ChatRequest(BaseModel):
    messages: List[Message]
    subject: Optional[str] = Field(None, description="Subject or context for the conversation")


class ChatResponse(BaseModel):
    reply: str
    used_model: str
