import { FormEvent, useMemo, useState } from "react";
import { sendChat } from "../services/api";
import type { Message } from "../types";

interface ChatPageProps {
  apiKey: string;
}

export default function ChatPage({ apiKey }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const canSend = useMemo(
    () => Boolean(input.trim()) && Boolean(apiKey) && !isSending,
    [apiKey, input, isSending],
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || !apiKey) {
      setError(apiKey ? "Escreva uma mensagem antes de enviar." : "Configure sua API key primeiro.");
      return;
    }

    setError(null);
    const userMessage: Message = { role: "user", content: input.trim() };
    const pendingMessages = [...messages, userMessage];
    setMessages(pendingMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await sendChat(
        { messages: pendingMessages, subject: subject || undefined },
        apiKey,
      );
      setMessages([...pendingMessages, { role: "assistant", content: response.reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao enviar mensagem.";
      setError(message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2>Assistente Educacional</h2>
          <p className="muted">Converse com o assistente sobre o assunto escolhido.</p>
        </div>
        <div className="subject-field">
          <label htmlFor="subject">Assunto</label>
          <input
            id="subject"
            type="text"
            placeholder="ex: Álgebra Linear"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      <div className="chat-window">
        {messages.length === 0 ? (
          <p className="muted">Nenhuma mensagem ainda. Envie a primeira pergunta.</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="role">{message.role}</div>
              <div>{message.content}</div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <textarea
          placeholder={apiKey ? "Digite sua mensagem..." : "Configure a API key antes de enviar"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!apiKey || isSending}
        />
        <button type="submit" disabled={!canSend}>
          {isSending ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
