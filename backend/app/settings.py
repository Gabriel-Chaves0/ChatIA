import os
from typing import List

from dotenv import load_dotenv


load_dotenv()


class Settings:
    """Lightweight settings holder built from environment variables."""

    def __init__(self) -> None:
        allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
        self.gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
        self.gemini_api_base: str = os.getenv("GEMINI_API_BASE", "https://generativelanguage.googleapis.com")
        self.gemini_api_version: str = os.getenv("GEMINI_API_VERSION", "v1beta")
        self.gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.allowed_origins: List[str] = [
            origin.strip() for origin in allowed_origins.split(",") if origin.strip()
        ]


settings = Settings()
