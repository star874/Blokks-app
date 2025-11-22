import React from 'react';

function PropertiesPanel({ darkMode, isCollapsed, onToggle, selectedNode }) {
  if (isCollapsed) {
    return (
      <div className={`properties-panel collapsed ${darkMode ? 'dark' : ''}`}>
        <button className="properties-toggle" onClick={onToggle}>
          ◀
        </button>
      </div>
    );
  }

  return (
    <aside className={`properties-panel ${darkMode ? 'dark' : ''}`}>
      <div className="properties-header">
        <h3>Properties</h3>
        <button className="properties-toggle" onClick={onToggle}>
          ▶
        </button>
      </div>
      
      <div className="properties-body">
        {selectedNode ? (
          <div className="property-info">
            <h4>{selectedNode.data.label}</h4>
            <p className="property-type">{selectedNode.data.type}</p>
            <div className="property-details">
              <label>Status:</label>
              <p>{selectedNode.data.isProcessing ? 'Processing...' : 'Ready'}</p>
            </div>
          </div>
        ) : (
          <div className="no-selection">
            <p>Select a block to view properties</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default PropertiesPanel;
