export const workflowTemplates = [
  {
    name: 'Image Analysis Pipeline',
    description: 'Upload an image and get AI-powered analysis with conditional routing',
    icon: '🖼️',
    tags: ['Vision', 'AI', 'Conditional'],
    nodes: [
      {
        id: '1',
        type: 'customNode',
        position: { x: 100, y: 50 },
        data: { 
          label: 'Image Input', 
          type: 'image-input',
          value: '',
          imageData: null,
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 100, y: 220 },
        data: { 
          label: 'AI Vision', 
          type: 'ai-vision',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '3',
        type: 'customNode',
        position: { x: 100, y: 390 },
        data: { 
          label: 'Contains Person?', 
          type: 'conditional',
          conditionType: 'contains',
          conditionValue: 'person',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: -50, y: 560 },
        data: { 
          label: 'Has Person', 
          type: 'text-output',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '5',
        type: 'customNode',
        position: { x: 250, y: 560 },
        data: { 
          label: 'No Person', 
          type: 'text-output',
          output: null,
          isProcessing: false,
          error: null
        },
      },
    ],
    edges: [],
    variables: {}
  },
  {
    name: 'Text Processing Chain',
    description: 'Process text through AI, transform it, and export to file',
    icon: '📝',
    tags: ['Text', 'AI', 'Export'],
    nodes: [
      {
        id: '1',
        type: 'customNode',
        position: { x: 250, y: 50 },
        data: { 
          label: 'Text Input', 
          type: 'text-input',
          value: 'Write a creative story about a robot',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 250, y: 200 },
        data: { 
          label: 'AI Process', 
          type: 'ai-process',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '3',
        type: 'customNode',
        position: { x: 250, y: 350 },
        data: { 
          label: 'Make Uppercase', 
          type: 'text-transform',
          transformType: 'uppercase',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: 250, y: 500 },
        data: { 
          label: 'Export to File', 
          type: 'file-export',
          filename: 'story.txt',
          output: null,
          isProcessing: false,
          error: null
        },
      },
    ],
    edges: [],
    variables: {}
  },
  {
    name: 'Multi-Source Combiner',
    description: 'Combine multiple inputs and process them together',
    icon: '🔗',
    tags: ['Combiner', 'AI'],
    nodes: [
      {
        id: '1',
        type: 'customNode',
        position: { x: 50, y: 50 },
        data: { 
          label: 'Input 1', 
          type: 'text-input',
          value: 'First piece of information',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 300, y: 50 },
        data: { 
          label: 'Input 2', 
          type: 'text-input',
          value: 'Second piece of information',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '3',
        type: 'customNode',
        position: { x: 175, y: 200 },
        data: { 
          label: 'Combine', 
          type: 'combiner',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: 175, y: 350 },
        data: { 
          label: 'AI Summary', 
          type: 'prompt-template',
          template: 'Summarize these combined inputs: {input}',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '5',
        type: 'customNode',
        position: { x: 175, y: 500 },
        data: { 
          label: 'Result', 
          type: 'text-output',
          output: null,
          isProcessing: false,
          error: null
        },
      },
    ],
    edges: [],
    variables: {}
  },
  {
    name: 'Variable Storage Demo',
    description: 'Use variables to store and reuse data across your workflow',
    icon: '🔢',
    tags: ['Variables', 'Storage'],
    nodes: [
      {
        id: '1',
        type: 'customNode',
        position: { x: 100, y: 50 },
        data: { 
          label: 'Input Data', 
          type: 'text-input',
          value: 'Important data to remember',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 100, y: 200 },
        data: { 
          label: 'Save to Variable', 
          type: 'variable',
          variableAction: 'set',
          variableName: 'myData',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '3',
        type: 'customNode',
        position: { x: 100, y: 350 },
        data: { 
          label: 'Load from Variable', 
          type: 'variable',
          variableAction: 'get',
          variableName: 'myData',
          output: null,
          isProcessing: false,
          error: null
        },
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: 100, y: 500 },
        data: { 
          label: 'Display', 
          type: 'text-output',
          output: null,
          isProcessing: false,
          error: null
        },
      },
    ],
    edges: [],
    variables: { myData: '' }
  },
];
