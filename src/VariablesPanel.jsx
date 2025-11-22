import React, { useState } from 'react';

function VariablesPanel({ variables, setVariables, onClose, darkMode }) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newKey.trim()) {
      setVariables({ ...variables, [newKey]: newValue });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleDelete = (key) => {
    const updated = { ...variables };
    delete updated[key];
    setVariables(updated);
  };

   return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔢 Variables</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="settings-help">
            Variables can be used across your workflow. Use Variable blocks to read/write them.
          </p>

          <div className="variables-add">
            <input
              type="text"
              placeholder="Variable name..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="variable-input"
            />
            <input
              type="text"
              placeholder="Initial value..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="variable-input"
            />
            <button onClick={handleAdd} className="add-variable-btn">
              + Add
            </button>
          </div>

          <div className="variables-list">
            {Object.keys(variables).length === 0 ? (
              <p className="no-variables">No variables yet. Add one above!</p>
            ) : (
              Object.entries(variables).map(([key, value]) => (
                <div key={key} className="variable-item">
                  <div className="variable-info">
                    <strong>{key}</strong>
                    <span className="variable-value">{value}</span>
                  </div>
                  <button 
                    className="delete-variable-btn"
                    onClick={() => handleDelete(key)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-button" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default VariablesPanel;
