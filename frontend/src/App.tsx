import { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";

type Tab = "chat" | "settings";

const API_KEY_STORAGE = "edu-assistant-api-key";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  function handleSaveKey(key: string) {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE, key);
  }

  return (
    <div className="layout">
      <header className="header">
        <div>
          <p className="eyebrow">Assistente Educacional</p>
          <h1>Seu tutor com IA</h1>
        </div>
        <nav className="tabs">
          <button
            className={activeTab === "chat" ? "active" : ""}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Configurações
          </button>
        </nav>
      </header>

      <main>
        {activeTab === "chat" ? (
          <ChatPage apiKey={apiKey} />
        ) : (
          <SettingsPage apiKey={apiKey} onSaveKey={handleSaveKey} />
        )}
      </main>
    </div>
  );
}
