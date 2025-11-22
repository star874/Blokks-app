import React, { useState } from 'react';

function CustomBlockEditor({ onSave, onClose, darkMode }) {
  const [blockName, setBlockName] = useState('');
  const [blockIcon, setBlockIcon] = useState('⚙️');
  const [blockColor, setBlockColor] = useState('#64748b');
  const [blockCode, setBlockCode] = useState(`// Your custom processing code
// Input is available as 'input' variable
// Return your output

return input.toUpperCase();`);

  const handleSave = () => {
    if (!blockName.trim()) {
      alert('Please enter a block name');
      return;
    }

    const customBlock = {
      name: blockName,
      icon: blockIcon,
      color: blockColor,
      code: blockCode,
    };

    onSave(customBlock);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content large ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Create Custom Block</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="custom-block-form">
            <div className="form-row">
              <div className="form-group">
                <label>Block Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  placeholder="My Custom Block"
                />
              </div>
              <div className="form-group small">
                <label>Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={blockIcon}
                  onChange={(e) => setBlockIcon(e.target.value)}
                  placeholder="⚙️"
                  maxLength={2}
                />
              </div>
              <div className="form-group small">
                <label>Color</label>
                <input
                  type="color"
                  className="form-input"
                  value={blockColor}
                  onChange={(e) => setBlockColor(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Processing Code (JavaScript)</label>
              <textarea
                className="code-editor"
                value={blockCode}
                onChange={(e) => setBlockCode(e.target.value)}
                placeholder="Enter your JavaScript code..."
                rows={12}
              />
              <p className="settings-help">
                Your code should return the output value. The input is available as the <code>input</code> variable.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Create Block</button>
        </div>
      </div>
    </div>
  );
}

export default CustomBlockEditor;
