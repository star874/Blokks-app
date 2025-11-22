import React from 'react';

const basicBlocks = [
  { name: 'Text Input', icon: '📝', color: '#10b981' },
  { name: 'AI Process', icon: '🤖', color: '#6366f1' },
  { name: 'Claude', icon: '🧠', color: '#d97706' },
  { name: 'Gemini', icon: '💎', color: '#0ea5e9' },
  { name: 'Text Output', icon: '📄', color: '#14b8a6' },
];

function Sidebar({ darkMode, isCollapsed, onToggle }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (isCollapsed) {
    return (
      <div className={`sidebar collapsed ${darkMode ? 'dark' : ''}`}>
        <button className="sidebar-toggle" onClick={onToggle}>
          ▶
        </button>
      </div>
    );
  }

  return (
    <aside className={`sidebar ${darkMode ? 'dark' : ''}`}>
      <div className="sidebar-header">
        <h3>Blocks</h3>
        <button className="sidebar-toggle" onClick={onToggle}>
          ◀
        </button>
      </div>
      
      <div className="block-list">
        {basicBlocks.map((block) => (
          <div
            key={block.name}
            className="block-item"
            draggable
            onDragStart={(e) => onDragStart(e, block.name)}
            style={{ borderLeftColor: block.color }}
          >
            <span className="block-icon">{block.icon}</span>
            <span className="block-name">{block.name}</span>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <p>Drag blocks to canvas</p>
      </div>
    </aside>
  );
}

export default Sidebar;
