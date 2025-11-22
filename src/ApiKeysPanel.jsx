import React, { useState } from 'react';

function ApiKeysPanel({ apiKeys, setApiKeys, onClose, darkMode }) {
  const [keys, setKeys] = useState([
    { id: 1, provider: apiKeys.openai ? 'OpenAI' : '', key: apiKeys.openai || '' },
  ]);

  const addKeySlot = () => {
    setKeys([...keys, { id: Date.now(), provider: '', key: '' }]);
  };

  const updateKey = (id, field, value) => {
    setKeys(keys.map(k => k.id === id ? { ...k, [field]: value } : k));
  };

  const removeKey = (id) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const handleSave = () => {
    const newApiKeys = {
      openai: '',
      anthropic: '',
      google: '',
    };

    keys.forEach(k => {
      if (k.provider === 'OpenAI') newApiKeys.openai = k.key;
      if (k.provider === 'Anthropic') newApiKeys.anthropic = k.key;
      if (k.provider === 'Google') newApiKeys.google = k.key;
    });

    setApiKeys(newApiKeys);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔑 API Keys</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {keys.map((keyItem) => (
            <div key={keyItem.id} className="api-key-slot">
              <select
                className="api-provider-select"
                value={keyItem.provider}
                onChange={(e) => updateKey(keyItem.id, 'provider', e.target.value)}
              >
                <option value="">Select Provider</option>
                <option value="OpenAI">OpenAI (GPT)</option>
                <option value="Anthropic">Anthropic (Claude)</option>
                <option value="Google">Google (Gemini)</option>
              </select>
              
              <input
                type="password"
                className="api-key-input"
                value={keyItem.key}
                onChange={(e) => updateKey(keyItem.id, 'key', e.target.value)}
                placeholder="Enter API key..."
              />

              {keys.length > 1 && (
                <button className="remove-key-btn" onClick={() => removeKey(keyItem.id)}>
                  ✕
                </button>
              )}
            </div>
          ))}

          <button className="add-key-btn" onClick={addKeySlot}>
            + Add Another API Key
          </button>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeysPanel;
