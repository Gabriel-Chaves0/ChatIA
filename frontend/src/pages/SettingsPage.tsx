import { FormEvent, useState } from "react";

interface SettingsPageProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export default function SettingsPage({ apiKey, onSaveKey }: SettingsPageProps) {
  const [value, setValue] = useState(apiKey);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSaveKey(value.trim());
  }

  return (
    <div className="card">
      <h2>Configurações</h2>
      <p className="muted">
        Salve sua chave de API para que o frontend envie no cabeçalho `X-API-Key` em cada chamada.
      </p>
      <form onSubmit={handleSubmit} className="settings-form">
        <label htmlFor="apiKey">API Key</label>
        <input
          id="apiKey"
          type="text"
          placeholder="coloque sua chave aqui"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Salvar</button>
      </form>
      {apiKey && <p className="muted">Chave atual salva.</p>}
    </div>
  );
}
