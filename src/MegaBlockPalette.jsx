import React, { useState } from 'react';
import { megaBlocks } from './megaBlocks';

function MegaBlockPalette({ darkMode, isCollapsed, onToggle }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(megaBlocks.map(b => b.category))];
  
  const filteredBlocks = selectedCategory === 'All' 
    ? megaBlocks 
    : megaBlocks.filter(b => b.category === selectedCategory);

  const onDragStart = (event, block) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(block));
    event.dataTransfer.effectAllowed = 'move';
  };

  if (isCollapsed) {
    return (
      <div className={`mega-palette collapsed ${darkMode ? 'dark' : ''}`}>
        <button className="palette-toggle" onClick={onToggle}>▶</button>
      </div>
    );
  }

  return (
    <div className={`mega-palette ${darkMode ? 'dark' : ''}`}>
      <div className="palette-header">
        <h3>Blocks</h3>
        <button className="palette-toggle" onClick={onToggle}>◀</button>
      </div>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="blocks-grid">
        {filteredBlocks.map((block) => (
          <div
            key={block.id}
            className="mega-block-card"
            draggable
            onDragStart={(e) => onDragStart(e, block)}
            style={{ borderLeftColor: block.color }}
          >
            <div className="mega-block-icon" style={{ color: block.color }}>
              {block.icon}
            </div>
            <div className="mega-block-info">
              <div className="mega-block-name">{block.name}</div>
              <div className="mega-block-modes">
                {block.modes.slice(0, 2).join(', ')}
                {block.modes.length > 2 && '...'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MegaBlockPalette;
