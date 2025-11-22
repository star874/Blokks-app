import React from 'react';

function TemplatesPanel({ templates, onLoad, onClose, darkMode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content large ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Workflow Templates</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="templates-description">
            Choose a pre-built workflow template to get started quickly
          </p>
          
          <div className="templates-grid">
            {templates.map((template, index) => (
              <div key={index} className="template-card">
                <div className="template-icon">{template.icon}</div>
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <div className="template-tags">
                  {template.tags.map((tag, i) => (
                    <span key={i} className="template-tag">{tag}</span>
                  ))}
                </div>
                <button 
                  className="template-load-btn"
                  onClick={() => onLoad(template)}
                >
                  Load Template
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default TemplatesPanel;
