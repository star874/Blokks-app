import React from 'react';

function KeyboardShortcutsPanel({ onClose, darkMode }) {
  const shortcuts = [
    { keys: 'Ctrl/Cmd + Z', action: 'Undo' },
    { keys: 'Ctrl/Cmd + Shift + Z', action: 'Redo' },
    { keys: 'Ctrl/Cmd + Y', action: 'Redo (alternative)' },
    { keys: 'Ctrl/Cmd + S', action: 'Save Workflow' },
    { keys: 'Ctrl/Cmd + O', action: 'Open Workflow' },
    { keys: 'Ctrl/Cmd + R', action: 'Run Workflow' },
    { keys: 'Ctrl/Cmd + D', action: 'Toggle Dark Mode' },
    { keys: 'Esc', action: 'Delete Selected Block' },
    { keys: '?', action: 'Show Shortcuts' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="shortcuts-list">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <kbd className="shortcut-keys">{shortcut.keys}</kbd>
                <span className="shortcut-action">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-button" onClick={onClose}>Got it!</button>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsPanel;
