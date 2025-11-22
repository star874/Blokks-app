export const megaBlocks = [
  // CONTROL FLOW CATEGORY
  {
    id: 'start-block',
    name: 'Start Block',
    icon: '🚀',
    color: '#10b981',
    category: 'Control Flow',
    modes: ['Entry Point'],
    defaultMode: 'Entry Point'
  },
  {
    id: 'end-block',
    name: 'End Block',
    icon: '🏁',
    color: '#10b981',
    category: 'Control Flow',
    modes: ['Termination'],
    defaultMode: 'Termination'
  },
  {
    id: 'break-block',
    name: 'Break Block',
    icon: '⛔',
    color: '#10b981',
    category: 'Control Flow',
    modes: ['Exit Loop'],
    defaultMode: 'Exit Loop'
  },
  {
    id: 'return-block',
    name: 'Return Block',
    icon: '↩️',
    color: '#10b981',
    category: 'Control Flow',
    modes: ['Return Value'],
    defaultMode: 'Return Value'
  },

  // INPUT CATEGORY
  {
    id: 'input-hub',
    name: 'Input Hub',
    icon: '📥',
    color: '#3b82f6',
    category: 'Input',
    modes: ['Text', 'Number', 'File', 'Webcam', 'Microphone'],
    defaultMode: 'Text'
  },
  {
    id: 'data-loader',
    name: 'Data Loader',
    icon: '📊',
    color: '#3b82f6',
    category: 'Input',
    modes: ['CSV', 'JSON', 'API', 'Webhook'],
    defaultMode: 'JSON'
  },

  // AI PROCESSING CATEGORY
  {
    id: 'ai-processor',
    name: 'AI Processor',
    icon: '🤖',
    color: '#6366f1',
    category: 'AI Processing',
    modes: ['GPT', 'Image', 'Voice', 'Vision'],
    defaultMode: 'GPT'
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    icon: '✨',
    color: '#6366f1',
    category: 'AI Processing',
    modes: ['Text', 'Image', 'Audio'],
    defaultMode: 'Text'
  },
  {
    id: 'data-analyzer',
    name: 'Data Analyzer',
    icon: '🔍',
    color: '#6366f1',
    category: 'AI Processing',
    modes: ['Analysis', 'Sentiment', 'Classification'],
    defaultMode: 'Analysis'
  },

  // LOGIC CATEGORY
  {
    id: 'logic-constructor',
    name: 'Logic Constructor',
    icon: '🔀',
    color: '#f59e0b',
    category: 'Logic',
    modes: ['If-Else', 'Switch', 'Conditions'],
    defaultMode: 'If-Else'
  },
  {
    id: 'loop-controller',
    name: 'Loop Controller',
    icon: '🔁',
    color: '#f59e0b',
    category: 'Logic',
    modes: ['For', 'While', 'Repeat'],
    defaultMode: 'For'
  },
  {
    id: 'state-manager',
    name: 'State Manager',
    icon: '💾',
    color: '#f59e0b',
    category: 'Logic',
    modes: ['Variables', 'State', 'Context'],
    defaultMode: 'Variables'
  },

  // DATA CATEGORY
  {
    id: 'math-processor',
    name: 'Math Processor',
    icon: '🔢',
    color: '#8b5cf6',
    category: 'Data',
    modes: ['Arithmetic', 'Advanced', 'Statistics'],
    defaultMode: 'Arithmetic'
  },
  {
    id: 'text-transformer',
    name: 'Text Transformer',
    icon: '✂️',
    color: '#8b5cf6',
    category: 'Data',
    modes: ['Join', 'Split', 'Format', 'Parse'],
    defaultMode: 'Format'
  },
  {
    id: 'list-operations',
    name: 'List Operations',
    icon: '📝',
    color: '#8b5cf6',
    category: 'Data',
    modes: ['Filter', 'Sort', 'Map', 'Reduce'],
    defaultMode: 'Filter'
  },
  {
    id: 'data-converter',
    name: 'Data Converter',
    icon: '🔄',
    color: '#8b5cf6',
    category: 'Data',
    modes: ['Type', 'Format', 'Encode', 'Decode'],
    defaultMode: 'Type'
  },

  // OUTPUT CATEGORY
  {
    id: 'display-manager',
    name: 'Display Manager',
    icon: '📺',
    color: '#14b8a6',
    category: 'Output',
    modes: ['Text', 'Image', 'Chart', 'Table'],
    defaultMode: 'Text'
  },
  {
    id: 'export-hub',
    name: 'Export Hub',
    icon: '💾',
    color: '#14b8a6',
    category: 'Output',
    modes: ['File', 'Download', 'Share', 'Cloud'],
    defaultMode: 'Download'
  },
  {
    id: 'media-player',
    name: 'Media Player',
    icon: '🎬',
    color: '#14b8a6',
    category: 'Output',
    modes: ['Audio', 'Video', 'Image'],
    defaultMode: 'Audio'
  },

  // INTEGRATION CATEGORY
  {
    id: 'api-connector',
    name: 'API Connector',
    icon: '🔗',
    color: '#ec4899',
    category: 'Integration',
    modes: ['HTTP', 'Webhook', 'GraphQL', 'REST'],
    defaultMode: 'HTTP'
  },
  {
    id: 'storage-manager',
    name: 'Storage Manager',
    icon: '🗄️',
    color: '#ec4899',
    category: 'Integration',
    modes: ['Local', 'Cloud', 'Database'],
    defaultMode: 'Local'
  },
  {
    id: 'notification-center',
    name: 'Notification Center',
    icon: '🔔',
    color: '#ec4899',
    category: 'Integration',
    modes: ['Email', 'Alert', 'Message', 'Push'],
    defaultMode: 'Alert'
  },

  // UTILITY CATEGORY
  {
    id: 'debug-tools',
    name: 'Debug Tools',
    icon: '🐛',
    color: '#64748b',
    category: 'Utility',
    modes: ['Log', 'Error', 'Performance', 'Trace'],
    defaultMode: 'Log'
  },
  {
    id: 'comment-sticky',
    name: 'Comment Sticky',
    icon: '📌',
    color: '#fbbf24',
    category: 'Utility',
    modes: ['Note', 'Annotation', 'Label'],
    defaultMode: 'Note'
  },
];
