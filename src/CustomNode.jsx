import React, { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useDropzone } from 'react-dropzone';

function CustomNode({ data, id }) {
  const [speaking, setSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getNodeColor = (type) => {
    const colorMap = {
      'input': '#10b981',
      'text-input': '#10b981',
      'image-input': '#8b5cf6',
      'variable': '#06b6d4',
      'batch-input': '#22c55e',
      'process': '#6366f1',
      'ai-process': '#6366f1',
      'ai-vision': '#ec4899',
      'claude': '#d97706',
      'gemini': '#0ea5e9',
      'prompt-template': '#3b82f6',
      'api-webhook': '#8b5cf6',
      'conditional': '#f59e0b',
      'combiner': '#06b6d4',
      'delay': '#84cc16',
      'text-transform': '#a855f7',
      'json-parser': '#f97316',
      'text-to-speech': '#14b8a6',
      'file-export': '#10b981',
      'custom-block': '#64748b',
      'output': '#14b8a6',
      'text-output': '#14b8a6',
       // ... KEEP ALL EXISTING COLORS ...
      
      // ============================================
      // COLORS: Advanced Blocks
      // Each category has its own color scheme
      // ============================================
      
      // Data Processing - purple
      'loop': '#8b5cf6',
      'filter': '#8b5cf6',
      'map': '#8b5cf6',
      'reduce': '#8b5cf6',
      
      // Data Storage - green
      'database': '#059669',
      'cache': '#059669',
      'spreadsheet': '#059669',
      
      // Web & APIs - blue
      'web-scraper': '#0ea5e9',
      'browser-auto': '#0ea5e9',
      'http-advanced': '#0ea5e9',
      
      // AI & ML - pink
      'image-generator': '#ec4899',
      'vector-db': '#ec4899',
      'llm-stream': '#ec4899',
      'voice-input': '#ec4899',
      
      // Flow Control - orange
      'switch-case': '#f59e0b',
      'error-handler': '#f59e0b',
      'parallel': '#f59e0b',
      'wait-until': '#f59e0b',
      
      // Utilities - gray
      'math': '#64748b',
      'date-time': '#64748b',
      'regex': '#64748b',
      'file-reader': '#64748b',
      
      // Communication - green
      'email': '#10b981',
      'notification': '#10b981',
      'webhook-in': '#10b981',
      
      // Advanced - indigo
      'sub-workflow': '#6366f1',
      'code-python': '#6366f1',
      'rate-limiter': '#6366f1'
    };
    return colorMap[type] || '#6366f1';
  };

  const getIcon = (type) => {
    const iconMap = {
      'input': '📝',
      'text-input': '📝',
      'image-input': '🖼️',
      'variable': '🔢',
      'batch-input': '📦',
      'process': '🤖',
      'ai-process': '🤖',
      'ai-vision': '👁️',
      'claude': '🧠',
      'gemini': '💎',
      'prompt-template': '📋',
      'api-webhook': '🔗',
      'conditional': '🔀',
      'combiner': '🔗',
      'delay': '⏱️',
      'text-transform': '✨',
      'json-parser': '📊',
      'text-to-speech': '🔊',
      'file-export': '💾',
      'custom-block': '⚙️',
      'output': '📄',
      'text-output': '📄',
      getIcon: function(type) {  // ✅ Correct method syntax
    const iconMap = {
      // ... KEEP ALL EXISTING ICONS ...
      
      // ============================================
      // ICONS: Advanced Blocks
      // Emoji icons for each advanced block type
      // ============================================
      'loop': '🔁',
      'filter': '🔍',
      'map': '🗺️',
      'reduce': '📊',
      'database': '🗄️',
      'cache': '💾',
      'spreadsheet': '📑',
      'web-scraper': '🕷️',
      'browser-auto': '🌐',
      'http-advanced': '🔐',
      'image-generator': '🎨',
      'vector-db': '🧠',
      'llm-stream': '💬',
      'voice-input': '🎤',
      'switch-case': '🔀',
      'error-handler': '🛡️',
      'parallel': '⚡',
      'wait-until': '⏰',
      'math': '🔢',
      'date-time': '📅',
      'regex': '🔤',
      'file-reader': '📂',
      'email': '📧',
      'notification': '🔔',
      'webhook-in': '📨',
      'sub-workflow': '📦',
      'code-python': '🐍',
      'rate-limiter': '⏱️',
    };
     return iconMap[type] || '⚙️';
    }
    };
    return iconMap[type] || '⚙️';
  };

  const color = getNodeColor(data.type);
  const icon = getIcon(data.type);
  const isTextInput = data.type === 'input' || data.type === 'text-input';
  const isImageInput = data.type === 'image-input';
  const isConditional = data.type === 'conditional';
  // ============================================
  // BLOCK TYPE CHECKS - Advanced Blocks
  // These constants check if the current block is a specific type
  // Used to show the right UI for each block type
  // ============================================
  
  // Data Processing blocks
  const isLoop = data.type === 'loop';
  const isFilter = data.type === 'filter';
  const isMap = data.type === 'map';
  const isReduce = data.type === 'reduce';
  
  // Data Storage blocks
  const isDatabase = data.type === 'database';
  const isCache = data.type === 'cache';
  const isSpreadsheet = data.type === 'spreadsheet';
  
  // Web & APIs blocks
  const isWebScraper = data.type === 'web-scraper';
  const isBrowserAuto = data.type === 'browser-auto';
  const isHttpAdvanced = data.type === 'http-advanced';
  
  // AI & ML blocks
  const isImageGenerator = data.type === 'image-generator';
  const isVectorDB = data.type === 'vector-db';
  const isLLMStream = data.type === 'llm-stream';
  const isVoiceInput = data.type === 'voice-input';
  
  // Flow Control blocks
  const isSwitchCase = data.type === 'switch-case';
  const isErrorHandler = data.type === 'error-handler';
  const isParallel = data.type === 'parallel';
  const isWaitUntil = data.type === 'wait-until';
  
  // Utilities blocks
  const isMath = data.type === 'math';
  const isDateTime = data.type === 'date-time';
  const isRegex = data.type === 'regex';
  const isFileReader = data.type === 'file-reader';
  
  // Communication blocks
  const isEmail = data.type === 'email';
  const isNotification = data.type === 'notification';
  const isWebhookIn = data.type === 'webhook-in';
  
  // Advanced blocks
  const isSubWorkflow = data.type === 'sub-workflow';
  const isCodePython = data.type === 'code-python';
  const isRateLimiter = data.type === 'rate-limiter';
  const isPromptTemplate = data.type === 'prompt-template';
  const isTextTransform = data.type === 'text-transform';
  const isJSONParser = data.type === 'json-parser';
  const isDelay = data.type === 'delay';
  const isVariable = data.type === 'variable';
  const isFileExport = data.type === 'file-export';
  const isTTS = data.type === 'text-to-speech';
  const isClaude = data.type === 'claude';
  const isGemini = data.type === 'gemini';
  const isApiWebhook = data.type === 'api-webhook';
  const isBatchInput = data.type === 'batch-input';
  const isCustomBlock = data.type === 'custom-block';
  const hasOutput = data.output !== null && data.output !== undefined;

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        data.imageData = reader.result;
        data.value = file.name;
      };
      reader.readAsDataURL(file);
    }
  }, [data]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: data.isProcessing
  });

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setIsPlaying(false);
    } else if (data.output) {
      const utterance = new SpeechSynthesisUtterance(data.output);
      utterance.onend = () => {
        setSpeaking(false);
        setIsPlaying(false);
      };
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setIsPlaying(true);
    }
  };

  return (
    <div 
      className={`custom-node ${data.isProcessing ? 'processing' : ''} ${data.error ? 'error' : ''}`}
      style={{ borderColor: color }}
    >
      {!isTextInput && !isImageInput && !isVariable && !isBatchInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="node-handle"
          style={{ background: color }}
        />
      )}
      
      <div className="node-header">
        <div className="node-icon" style={{ color: color }}>
          {data.isProcessing ? '⏳' : icon}
        </div>
        <div className="node-label">{data.label}</div>
      </div>

      <div className="node-comment-section">
        <input
          type="text"
          className="node-comment"
          value={data.comment || ''}
          onChange={(e) => {
            data.comment = e.target.value;
          }}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Add a comment..."
        />
      </div>

      <div className="node-body">
        {isTextInput && (
          <textarea
            className="node-input"
            value={data.value || ''}
            onChange={(e) => {
              data.value = e.target.value;
            }}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="Enter text here..."
            rows={3}
          />
        )}

        {isImageInput && (
          <div {...getRootProps()} className={`image-dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {data.imageData ? (
              <div className="image-preview">
                <img src={data.imageData} alt="Uploaded" />
                <p className="image-name">{data.value}</p>
              </div>
            ) : (
              <div className="dropzone-placeholder">
                <span className="dropzone-icon">📁</span>
                <p>{isDragActive ? 'Drop image here' : 'Drag image or click to upload'}</p>
              </div>
            )}
          </div>
        )}

        {isPromptTemplate && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Template (use {'{input}'} for placeholder):</label>
            <textarea
              className="node-input"
              value={data.template || 'Analyze this text: {input}'}
              onChange={(e) => {
                data.template = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Enter your prompt template..."
              rows={4}
            />
          </div>
        )}

        {isTextTransform && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Transform Type:</label>
            <select 
              className="condition-select"
              value={data.transformType || 'uppercase'}
              onChange={(e) => {
                data.transformType = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="uppercase">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="capitalize">Capitalize First Letter</option>
              <option value="reverse">Reverse Text</option>
              <option value="trim">Remove Whitespace</option>
              <option value="replace">Find & Replace</option>
            </select>

            {data.transformType === 'replace' && (
              <>
                <input
                  type="text"
                  className="condition-input"
                  placeholder="Find text..."
                  value={data.findText || ''}
                  onChange={(e) => {
                    data.findText = e.target.value;
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <input
                  type="text"
                  className="condition-input"
                  placeholder="Replace with..."
                  value={data.replaceText || ''}
                  onChange={(e) => {
                    data.replaceText = e.target.value;
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </>
            )}
          </div>
        )}

        {isJSONParser && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>JSON Path (e.g., data.name or items[0].value):</label>
            <input
              type="text"
              className="condition-input"
              placeholder="data.fieldName"
              value={data.jsonPath || ''}
              onChange={(e) => {
                data.jsonPath = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {isDelay && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Delay (seconds):</label>
            <input
              type="number"
              className="condition-input"
              placeholder="1"
              min="0"
              max="60"
              value={data.delaySeconds || '1'}
              onChange={(e) => {
                data.delaySeconds = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {isVariable && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Action:</label>
            <select 
              className="condition-select"
              value={data.variableAction || 'get'}
              onChange={(e) => {
                data.variableAction = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="get">Get Variable</option>
              <option value="set">Set Variable</option>
            </select>

            <label>Variable Name:</label>
            <input
              type="text"
              className="condition-input"
              placeholder="myVariable"
              value={data.variableName || ''}
              onChange={(e) => {
                data.variableName = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {isFileExport && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Filename:</label>
            <input
              type="text"
              className="condition-input"
              placeholder="output.txt"
              value={data.filename || 'output.txt'}
              onChange={(e) => {
                data.filename = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {isClaude && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Model:</label>
            <select 
              className="condition-select"
              value={data.claudeModel || 'claude-3-5-sonnet-20241022'}
              onChange={(e) => {
                data.claudeModel = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </select>
          </div>
        )}

        {isGemini && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Model:</label>
            <select 
              className="condition-select"
              value={data.geminiModel || 'gemini-pro'}
              onChange={(e) => {
                data.geminiModel = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gemini-pro-vision">Gemini Pro Vision</option>
            </select>
          </div>
        )}

        {isApiWebhook && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Method:</label>
            <select 
              className="condition-select"
              value={data.apiMethod || 'GET'}
              onChange={(e) => {
                data.apiMethod = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <label>URL:</label>
            <input
              type="text"
              className="condition-input"
              placeholder="https://api.example.com/endpoint"
              value={data.apiUrl || ''}
              onChange={(e) => {
                data.apiUrl = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />

            <label>Headers (JSON):</label>
            <textarea
              className="node-input"
              value={data.apiHeaders || '{"Content-Type": "application/json"}'}
              onChange={(e) => {
                data.apiHeaders = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder='{"Authorization": "Bearer token"}'
              rows={3}
            />
          </div>
        )}

        {isBatchInput && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Enter items (one per line):</label>
            <textarea
              className="node-input"
              value={data.batchItems || 'Item 1\nItem 2\nItem 3'}
              onChange={(e) => {
                data.batchItems = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Item 1&#10;Item 2&#10;Item 3"
              rows={6}
            />
          </div>
        )}

        {isCustomBlock && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Custom Code:</label>
            <textarea
              className="node-input code-input"
              value={data.customCode || '// Your code here\nreturn input;'}
              onChange={(e) => {
                data.customCode = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="// Write your JavaScript code"
              rows={8}
            />
            <p className="settings-help" style={{ fontSize: '11px', marginTop: '4px' }}>
              Use <code>input</code> variable. Return your output.
            </p>
          </div>
        )}
        {/* ============================================
            LOOP BLOCK UI
            Shows settings for iterating over data
            ============================================ */}
        {isLoop && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Loop through:</label>
            {/* Dropdown to select what to loop over */}
            <select 
              className="condition-select"
              value={data.loopType || 'array'}
              onChange={(e) => {
                data.loopType = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="array">Array (from input)</option>
              <option value="range">Range (1 to N)</option>
              <option value="lines">Lines of text</option>
            </select>

            {/* If range is selected, show count input */}
            {data.loopType === 'range' && (
              <>
                <label>Count:</label>
                <input
                  type="number"
                  className="condition-input"
                  placeholder="10"
                  value={data.loopCount || '10'}
                  onChange={(e) => {
                    data.loopCount = e.target.value;
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </>
            )}
          </div>
        )}

        {/* ============================================
            DATABASE BLOCK UI
            Shows settings for SQL queries
            ============================================ */}
        {isDatabase && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Operation:</label>
            {/* Dropdown to select database operation */}
            <select 
              className="condition-select"
              value={data.dbOperation || 'query'}
              onChange={(e) => {
                data.dbOperation = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="query">Query (SELECT)</option>
              <option value="insert">Insert</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>

            <label>SQL Query:</label>
            {/* Textarea for SQL query */}
            <textarea
              className="node-input code-input"
              value={data.dbQuery || 'SELECT * FROM data WHERE id = ?'}
              onChange={(e) => {
                data.dbQuery = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="SELECT * FROM data"
              rows={4}
            />
          </div>
        )}

        {/* ============================================
            MATH BLOCK UI
            Shows settings for mathematical operations
            ============================================ */}
        {isMath && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Operation:</label>
            {/* Dropdown to select math operation */}
            <select 
              className="condition-select"
              value={data.mathOp || 'add'}
              onChange={(e) => {
                data.mathOp = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="add">Add (+)</option>
              <option value="subtract">Subtract (-)</option>
              <option value="multiply">Multiply (×)</option>
              <option value="divide">Divide (÷)</option>
              <option value="power">Power (^)</option>
              <option value="sqrt">Square Root</option>
              <option value="average">Average</option>
              <option value="sum">Sum Array</option>
            </select>

            {/* If operation needs a second number, show input */}
            {['add', 'subtract', 'multiply', 'divide', 'power'].includes(data.mathOp) && (
              <>
                <label>Second Number:</label>
                <input
                  type="number"
                  className="condition-input"
                  placeholder="0"
                  value={data.mathValue || '0'}
                  onChange={(e) => {
                    data.mathValue = e.target.value;
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </>
            )}
          </div>
        )}

        {/* ============================================
            EMAIL BLOCK UI
            Shows settings for sending emails
            ============================================ */}
        {isEmail && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>To:</label>
            {/* Email recipient input */}
            <input
              type="email"
              className="condition-input"
              placeholder="recipient@example.com"
              value={data.emailTo || ''}
              onChange={(e) => {
                data.emailTo = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />

            <label>Subject:</label>
            {/* Email subject input */}
            <input
              type="text"
              className="condition-input"
              placeholder="Email subject"
              value={data.emailSubject || ''}
              onChange={(e) => {
                data.emailSubject = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* ============================================
            WEB SCRAPER BLOCK UI
            Shows settings for scraping websites
            ============================================ */}
        {isWebScraper && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>URL:</label>
            {/* URL to scrape */}
            <input
              type="url"
              className="condition-input"
              placeholder="https://example.com"
              value={data.scrapeUrl || ''}
              onChange={(e) => {
                data.scrapeUrl = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />

            <label>CSS Selector:</label>
            {/* CSS selector to target specific elements */}
            <input
              type="text"
              className="condition-input"
              placeholder=".class-name or #id"
              value={data.scrapeSelector || ''}
              onChange={(e) => {
                data.scrapeSelector = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {isConditional && !data.isProcessing && !hasOutput && (
          <div className="block-settings">
            <label>Condition Type:</label>
            <select 
              className="condition-select"
              value={data.conditionType || 'contains'}
              onChange={(e) => {
                data.conditionType = e.target.value;
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <option value="contains">Contains text</option>
              <option value="not-contains">Does not contain</option>
              <option value="length">Text length</option>
              <option value="sentiment">Sentiment (AI)</option>
            </select>

            {(data.conditionType === 'contains' || data.conditionType === 'not-contains') && (
              <input
                type="text"
                className="condition-input"
                placeholder="Text to check..."
                value={data.conditionValue || ''}
                onChange={(e) => {
                  data.conditionValue = e.target.value;
                }}
                onKeyDown={(e) => e.stopPropagation()}
              />
            )}

            {data.conditionType === 'length' && (
              <div className="condition-length">
                <select
                  className="condition-operator"
                  value={data.conditionOperator || 'greater'}
                  onChange={(e) => {
                    data.conditionOperator = e.target.value;
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <option value="greater">Greater than</option>
                  <option value="less">Less than</option>
                </select>
                <input
                  type="number"
                  className="condition-input"
                  placeholder="Length"
                  value={data.conditionValue || ''}
                  onChange={(e) => {
                    data.conditionValue = e.target.value;
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        )}

        {data.isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        )}

        {data.error && (
          <div className="error-message">
            ❌ {data.error}
          </div>
        )}

        {hasOutput && !data.isProcessing && (
          <div className="node-output">
            {isConditional ? (
              <>
                <strong>Result:</strong>
                <div className="output-content conditional-result">
                  {data.output === true ? '✅ TRUE - Routing to TRUE path' : '❌ FALSE - Routing to FALSE path'}
                </div>
              </>
            ) : isTTS ? (
              <>
                <strong>Audio Ready:</strong>
                <button 
                  className="tts-button"
                  onClick={handleSpeak}
                >
                  {speaking ? '⏸️ Stop' : '▶️ Play Audio'}
                </button>
                <div className="output-content">{data.output}</div>
              </>
            ) : (
              <>
                <strong>Output:</strong>
                <div className="output-content">{data.output}</div>
              </>
            )}
          </div>
        )}
      </div>
      
      {isConditional ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="node-handle handle-true"
            style={{ background: '#10b981', left: '30%' }}
          />
          <div className="handle-label handle-label-true">TRUE</div>
          
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="node-handle handle-false"
            style={{ background: '#ef4444', left: '70%' }}
          />
          <div className="handle-label handle-label-false">FALSE</div>
        </>
      ) : (
        (isTextInput || isImageInput || isBatchInput || data.type === 'process' || data.type === 'ai-process' || 
         data.type === 'ai-vision' || isClaude || isGemini || isPromptTemplate || data.type === 'combiner' || 
         isDelay || isTextTransform || isJSONParser || isTTS || isVariable || isApiWebhook || isCustomBlock) && (
          <Handle
            type="source"
            position={Position.Bottom}
            className="node-handle"
            style={{ background: color }}
          />
        )
      )}
    </div>
  );
}

export default CustomNode;
