import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

function MegaBlock({ data, id, selected }) {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextAction = (action) => {
    console.log(`Action: ${action} on block ${id}`);
    setContextMenu(null);
  };

  const isInputBlock = data.category === 'Input' || data.id === 'start-block';
  const isOutputBlock = data.category === 'Output' || data.id === 'end-block';
  const isStickyNote = data.id === 'comment-sticky';

  return (
    <>
      <div
        className={`mega-block ${data.isProcessing ? 'processing' : ''} ${selected ? 'selected' : ''} ${isStickyNote ? 'sticky-note' : ''}`}
        style={{ borderColor: data.color }}
        onContextMenu={handleContextMenu}
      >
        {!isInputBlock && !isStickyNote && (
          <Handle
            type="target"
            position={Position.Top}
            className="mega-handle"
            style={{ background: data.color }}
          />
        )}

        <div className="mega-block-header" style={{ background: `${data.color}15`, borderBottom: `2px solid ${data.color}` }}>
          <div className="mega-block-icon" style={{ color: data.color }}>
            {data.isProcessing ? '⏳' : data.icon}
          </div>
          <div className="mega-block-title">{data.name}</div>
        </div>

        <div className="mega-block-body">
          {data.modes && data.modes.length > 1 && (
            <select
              className="mode-selector"
              value={data.currentMode || data.defaultMode}
              onChange={(e) => {
                data.currentMode = e.target.value;
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {data.modes.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          )}

          {isStickyNote && (
            <textarea
              className="sticky-textarea"
              placeholder="Add your note here..."
              defaultValue={data.value || ''}
              onChange={(e) => {
                data.value = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
              rows={6}
            />
          )}

          {data.isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <span>Processing...</span>
            </div>
          )}

          {data.error && (
            <div className="error-message">❌ {data.error}</div>
          )}

          {data.output && !data.isProcessing && !isStickyNote && (
            <div className="mega-output">
              <strong>Result:</strong>
              <div className="output-content">{data.output}</div>
            </div>
          )}
        </div>

        {!isOutputBlock && !isStickyNote && (
          <Handle
            type="source"
            position={Position.Bottom}
            className="mega-handle"
            style={{ background: data.color }}
          />
        )}
      </div>

      {contextMenu && (
        <>
          <div className="context-menu-overlay" onClick={() => setContextMenu(null)} />
          <div
            className="context-menu"
            style={{ 
              left: `${contextMenu.x}px`, 
              top: `${contextMenu.y}px`,
              position: 'fixed'
            }}
          >
            <div className="context-menu-item" onClick={() => handleContextAction('duplicate')}>
              📋 Duplicate Block
            </div>
            <div className="context-menu-item" onClick={() => handleContextAction('delete')}>
              🗑️ Delete Block
            </div>
            <div className="context-menu-item" onClick={() => handleContextAction('properties')}>
              ⚙️ Edit Properties
            </div>
            <div className="context-menu-divider" />
            <div className="context-menu-item" onClick={() => handleContextAction('comment')}>
              📌 Add Sticky Note
            </div>
            <div className="context-menu-item" onClick={() => handleContextAction('copy')}>
              📋 Copy
            </div>
            <div className="context-menu-item" onClick={() => handleContextAction('paste')}>
              📄 Paste
            </div>
            <div className="context-menu-divider" />
            <div className="context-menu-item" onClick={() => handleContextAction('disable')}>
              🔇 {data.disabled ? 'Enable' : 'Disable'} Block
            </div>
            <div className="context-menu-item" onClick={() => handleContextAction('help')}>
              ❓ Help
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MegaBlock;
