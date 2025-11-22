import React from 'react';

function HelpPanel({ onClose, darkMode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>❓ Help & Documentation</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body help-content">
          <section className="help-section">
            <h3>🎯 Getting Started</h3>
            <ol>
              <li>Add your API key in Settings (🔑)</li>
              <li>Drag blocks from the palette to the canvas</li>
              <li>Connect blocks by dragging between connection points</li>
              <li>Click Run (▶️) to execute your workflow</li>
            </ol>
          </section>

          <section className="help-section">
            <h3>📦 Basic Blocks</h3>
            <ul>
              <li><strong>Text Input:</strong> Enter text manually</li>
              <li><strong>AI Process:</strong> Send text to GPT-3.5</li>
              <li><strong>Text Output:</strong> Display results</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>⚙️ Advanced Blocks</h3>
            <p>Click the 🔧 Advanced Blocks button to access:</p>
            <ul>
              <li><strong>Loops & Data Processing</strong></li>
              <li><strong>Database & Storage</strong></li>
              <li><strong>Web Scraping & APIs</strong></li>
              <li><strong>Custom Code Blocks</strong></li>
            </ul>
          </section>

          <section className="help-section">
            <h3>⌨️ Keyboard Shortcuts</h3>
            <ul>
              <li><strong>Ctrl+S:</strong> Save workflow</li>
              <li><strong>Ctrl+Z:</strong> Undo</li>
              <li><strong>Ctrl+Y:</strong> Redo</li>
              <li><strong>Esc:</strong> Delete selected block</li>
              <li><strong>Ctrl+R:</strong> Run workflow</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>💡 Tips</h3>
            <ul>
              <li>Connect blocks by dragging from bottom to top circles</li>
              <li>Add comments to blocks for documentation</li>
              <li>Use Variables to store data between blocks</li>
              <li>Save your workflows as JSON files</li>
            </ul>
          </section>
        </div>

        <div className="modal-footer">
          <button className="save-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default HelpPanel;
