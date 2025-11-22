import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import MegaBlockPalette from './MegaBlockPalette';
import MegaBlock from './MegaBlock';
import ChatStage from './ChatStage';
import ApiKeysPanel from './ApiKeysPanel';
import { executeWorkflow } from './workflowEngine';

const nodeTypes = {
  megaBlock: MegaBlock,
};

let id = 1;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [apiKeys, setApiKeys] = useState({ openai: '', anthropic: '', google: '' });
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [variables, setVariables] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Escape' && fullScreen) {
        setFullScreen(false);
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodes = nodes.filter(node => node.selected);
        const selectedEdges = edges.filter(edge => edge.selected);
        
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          e.preventDefault();
          setNodes(nodes.filter(node => !node.selected));
          setEdges(edges.filter(edge => !edge.selected));
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullScreen, nodes, edges]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#667eea', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#667eea',
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const blockData = event.dataTransfer.getData('application/reactflow');
      if (!blockData) return;

      const block = JSON.parse(blockData);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${id++}`,
        type: 'megaBlock',
        position,
        data: {
          ...block,
          currentMode: block.defaultMode,
          value: '',
          output: null,
          isProcessing: false,
          error: null,
          disabled: false
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSendMessage = (message) => {
    setChatMessages(prev => [...prev, {
      type: 'input',
      content: message,
      timestamp: Date.now()
    }]);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'output',
        content: `Received: "${message}" - Connect blocks to process this input.`,
        timestamp: Date.now()
      }]);
    }, 500);
  };

  const handleRun = async () => {
    if (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.google) {
      alert('Please set at least one API key in Settings first!');
      setShowApiKeys(true);
      return;
    }

    setIsExecuting(true);

    try {
      const inputNodes = nodes.filter(n => n.data.category === 'Input' && n.data.value);
      if (inputNodes.length > 0) {
        const groupedInput = inputNodes.map(n => n.data.value).join('\n');
        setChatMessages(prev => [...prev, {
          type: 'input',
          content: groupedInput,
          blockName: 'Workflow Input',
          timestamp: Date.now()
        }]);
      }

      await executeWorkflow(nodes, edges, apiKeys, updateNodeData, variables, []);

      const outputNodes = nodes.filter(n => n.data.output && n.data.category === 'Output');
      if (outputNodes.length > 0) {
        const groupedOutput = outputNodes.map(n => n.data.output).join('\n\n');
        setChatMessages(prev => [...prev, {
          type: 'output',
          content: groupedOutput,
          blockName: 'Workflow Output',
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Workflow execution failed:', error);
      setChatMessages(prev => [...prev, {
        type: 'output',
        content: `❌ Error: ${error.message}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = () => {
    const workflow = {
      nodes: nodes.map(node => ({
        ...node,
        data: { ...node.data, output: null, isProcessing: false, error: null }
      })),
      edges,
      variables,
      metadata: {
        name: 'Blokks Workflow',
        createdAt: new Date().toISOString(),
        version: '1.0'
      }
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blokks-workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target.result);
        
        if (workflow.nodes && workflow.edges) {
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
          setVariables(workflow.variables || {});
          
          const maxId = Math.max(...workflow.nodes.map(n => parseInt(n.id) || 0), 0);
          id = maxId + 1;
          
          setChatMessages(prev => [...prev, {
            type: 'output',
            content: '✅ Workflow loaded successfully!',
            timestamp: Date.now()
          }]);
        }
      } catch (error) {
        alert('Error loading workflow: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClear = () => {
    if (window.confirm('Clear all blocks? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
      setChatMessages([]);
    }
  };

  const handleNew = () => {
    if (window.confirm('Start a new workflow? Unsaved changes will be lost.')) {
      setNodes([]);
      setEdges([]);
      setChatMessages([]);
      setVariables({});
    }
  };

  return (
    <div className={`blokks-app ${darkMode ? 'dark-mode' : ''} ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="blokks-ribbon">
        <div className="ribbon-brand">
          <h1>⚡ Blokks</h1>
        </div>

        <div className="ribbon-section">
          <div className="ribbon-group">
            <button className="ribbon-btn" onClick={handleNew} title="New Workflow">
              <span className="ribbon-icon">📄</span>
              <span>New</span>
            </button>
            <button className="ribbon-btn" onClick={handleSave} title="Save (Ctrl+S)">
              <span className="ribbon-icon">💾</span>
              <span>Save</span>
            </button>
            <button className="ribbon-btn" onClick={() => fileInputRef.current?.click()} title="Open">
              <span className="ribbon-icon">📂</span>
              <span>Open</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleLoad} />
          </div>

          <div className="ribbon-divider" />

          <div className="ribbon-group">
            <button 
              className="ribbon-btn primary" 
              onClick={handleRun} 
              disabled={isExecuting}
              title="Run Workflow (Ctrl+R)"
            >
              <span className="ribbon-icon">{isExecuting ? '⏳' : '▶️'}</span>
              <span>{isExecuting ? 'Running' : 'Run'}</span>
            </button>
            <button className="ribbon-btn" onClick={handleClear} title="Clear All">
              <span className="ribbon-icon">🗑️</span>
              <span>Clear</span>
            </button>
          </div>

          <div className="ribbon-divider" />

          <div className="ribbon-group">
            <button 
              className="ribbon-btn" 
              onClick={() => setFullScreen(!fullScreen)} 
              title={fullScreen ? 'Exit Full Screen (Esc)' : 'Full Screen'}
            >
              <span className="ribbon-icon">{fullScreen ? '⛶' : '⛶'}</span>
              <span>{fullScreen ? 'Exit' : 'Expand'}</span>
            </button>
            <button className="ribbon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
              <span className="ribbon-icon">{darkMode ? '☀️' : '🌙'}</span>
              <span>Theme</span>
            </button>
          </div>

          <div className="ribbon-divider" />

          <div className="ribbon-group">
            <button className="ribbon-btn" onClick={() => setShowApiKeys(true)} title="API Keys">
              <span className="ribbon-icon">🔑</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="blokks-workspace">
        {!fullScreen && (
          <MegaBlockPalette
            darkMode={darkMode}
            isCollapsed={paletteCollapsed}
            onToggle={() => setPaletteCollapsed(!paletteCollapsed)}
          />
        )}

        <div className="blokks-main">
          <div className="canvas-container">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background color={darkMode ? "#444" : "#aaa"} gap={16} />
              <Controls />
            </ReactFlow>
          </div>

          <ChatStage 
            messages={chatMessages} 
            darkMode={darkMode}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {showApiKeys && (
        <ApiKeysPanel
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          onClose={() => setShowApiKeys(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App;
