import type { ChatRequest, ChatResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function sendChat(payload: ChatRequest, apiKey: string): Promise<ChatResponse> {
  if (!apiKey) {
    throw new Error("API key is missing. Configure it on the Settings page.");
  }

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`API error: ${response.status} ${detail || response.statusText}`);
  }

  return response.json();
}
