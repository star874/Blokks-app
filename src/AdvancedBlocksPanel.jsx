import React, { useState } from 'react';

const advancedBlocks = [
  { name: 'Image Input', icon: '🖼️', color: '#8b5cf6', category: 'Input' },
  { name: 'Variable', icon: '🔢', color: '#06b6d4', category: 'Input' },
  { name: 'Batch Input', icon: '📦', color: '#22c55e', category: 'Input' },
  
  { name: 'AI Vision', icon: '👁️', color: '#ec4899', category: 'AI Models' },
  { name: 'Prompt Template', icon: '📋', color: '#3b82f6', category: 'AI Models' },
  
  { name: 'Loop', icon: '🔁', color: '#8b5cf6', category: 'Logic' },
  { name: 'Filter', icon: '🔍', color: '#8b5cf6', category: 'Logic' },
  { name: 'Conditional', icon: '🔀', color: '#f59e0b', category: 'Logic' },
  { name: 'Combiner', icon: '🔗', color: '#06b6d4', category: 'Logic' },
  { name: 'Delay', icon: '⏱️', color: '#84cc16', category: 'Logic' },
  
  { name: 'Text Transform', icon: '✨', color: '#a855f7', category: 'Processing' },
  { name: 'JSON Parser', icon: '📊', color: '#f97316', category: 'Processing' },
  { name: 'Math', icon: '🔢', color: '#64748b', category: 'Processing' },
  { name: 'Regex', icon: '🔤', color: '#64748b', category: 'Processing' },
  
  { name: 'API Webhook', icon: '🔗', color: '#8b5cf6', category: 'Integration' },
  { name: 'Database', icon: '🗄️', color: '#059669', category: 'Integration' },
  { name: 'Web Scraper', icon: '🕷️', color: '#0ea5e9', category: 'Integration' },
  { name: 'Email', icon: '📧', color: '#10b981', category: 'Integration' },
  
  { name: 'Text to Speech', icon: '🔊', color: '#14b8a6', category: 'Output' },
  { name: 'File Export', icon: '💾', color: '#10b981', category: 'Output' },
  
  { name: 'Custom Block', icon: '⚙️', color: '#64748b', category: 'Custom' },
];

function AdvancedBlocksPanel({ onClose, darkMode, onDragStart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(advancedBlocks.map(b => b.category))];

  const filteredBlocks = selectedCategory === 'All' 
    ? advancedBlocks 
    : advancedBlocks.filter(b => b.category === selectedCategory);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content extra-large ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔧 Advanced Blocks</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="advanced-blocks-description">
            Drag advanced blocks to the canvas for complex workflows
          </p>

          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="advanced-blocks-grid">
            {filteredBlocks.map((block, index) => (
              <div
                key={index}
                className="advanced-block-card"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', block.name);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                style={{ borderTopColor: block.color }}
              >
                <div className="advanced-block-icon" style={{ color: block.color }}>
                  {block.icon}
                </div>
                <div className="advanced-block-info">
                  <h4 className="advanced-block-name">{block.name}</h4>
                  <span className="advanced-block-category" style={{ color: block.color }}>
                    {block.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default AdvancedBlocksPanel;
