import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function executeWorkflow(nodes, edges, apiKeys, updateNodeData, variables, customBlocks) {
  nodes.forEach(node => {
    updateNodeData(node.id, { 
      output: null, 
      isProcessing: false, 
      error: null 
    });
  });

  const inputNodes = nodes.filter(node => 
    ((node.data.type === 'input' || node.data.type === 'text-input' || 
      node.data.type === 'image-input' || node.data.type === 'variable' ||
      node.data.type === 'batch-input') &&
    !edges.some(edge => edge.target === node.id))
  );

  for (const inputNode of inputNodes) {
    // Handle batch processing
    if (inputNode.data.type === 'batch-input') {
      const items = (inputNode.data.batchItems || '').split('\n').filter(item => item.trim());
      
      for (let i = 0; i < items.length; i++) {
        updateNodeData(inputNode.id, { 
          output: `Processing batch item ${i + 1}/${items.length}: ${items[i]}`,
          currentBatchItem: items[i]
        });
        
        await processNode(inputNode, nodes, edges, apiKeys, updateNodeData, new Set(), variables, customBlocks, items[i]);
        
        // Small delay between batch items
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      updateNodeData(inputNode.id, { 
        output: `Batch processing complete: ${items.length} items processed`
      });
    } else {
      await processNode(inputNode, nodes, edges, apiKeys, updateNodeData, new Set(), variables, customBlocks);
    }
  }
}

async function processNode(node, nodes, edges, apiKeys, updateNodeData, visited, variables, customBlocks, batchItem = null) {
  if (visited.has(node.id)) return;
  visited.add(node.id);

  const nodeType = node.data.type;

  try {
    updateNodeData(node.id, { isProcessing: true, error: null });

    let output = null;

    if (nodeType === 'input' || nodeType === 'text-input') {
      output = node.data.value || '';
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'batch-input') {
      output = batchItem || node.data.batchItems || '';
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'image-input') {
      if (!node.data.imageData) {
        throw new Error('No image uploaded');
      }
      output = node.data.imageData;
      updateNodeData(node.id, { output: 'Image uploaded: ' + node.data.value });
      
    } else if (nodeType === 'process' || nodeType === 'ai-process') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to AI Process block');
      }

      output = await callOpenAI(inputValue, apiKeys.openai);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'ai-vision') {
      const inputData = await getInputFromConnectedNodes(node.id, nodes, edges, true);
      
      if (!inputData.imageData) {
        throw new Error('No image connected to AI Vision block');
      }

      const prompt = inputData.textData || "What's in this image? Provide a detailed description.";
      output = await callGPT4Vision(inputData.imageData, prompt, apiKeys.openai);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'claude') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to Claude block');
      }

      const model = node.data.claudeModel || 'claude-3-5-sonnet-20241022';
      output = await callClaude(inputValue, apiKeys.anthropic, model);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'gemini') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to Gemini block');
      }

      const model = node.data.geminiModel || 'gemini-pro';
      output = await callGemini(inputValue, apiKeys.google, model);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'prompt-template') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to Prompt Template block');
      }

      const template = node.data.template || 'Analyze this text: {input}';
      const prompt = template.replace(/{input}/g, inputValue);
      
      output = await callOpenAI(prompt, apiKeys.openai);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'api-webhook') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      const method = node.data.apiMethod || 'GET';
      const url = node.data.apiUrl;
      
      if (!url) {
        throw new Error('API URL not specified');
      }

      output = await callApiWebhook(url, method, inputValue, node.data.apiHeaders);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'conditional') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to Conditional block');
      }

      const result = await evaluateCondition(node, inputValue, apiKeys.openai);
      output = result;
      updateNodeData(node.id, { output: result });
      
    } else if (nodeType === 'combiner') {
      const allInputs = await getAllInputsFromConnectedNodes(node.id, nodes, edges);
      
      if (allInputs.length === 0) {
        throw new Error('No inputs connected to Combiner block');
      }

      output = allInputs.join('\n\n---\n\n');
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'delay') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      const delaySeconds = parseFloat(node.data.delaySeconds) || 1;
      
      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      
      output = inputValue || '';
      updateNodeData(node.id, { output: `Delayed ${delaySeconds}s: ${output}` });
      
    } else if (nodeType === 'text-transform') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to Text Transform block');
      }

      output = applyTextTransform(inputValue, node.data);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'json-parser') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to JSON Parser block');
      }

      output = parseJSON(inputValue, node.data.jsonPath);
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'text-to-speech') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to Text to Speech block');
      }

      output = inputValue;
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'variable') {
      const action = node.data.variableAction || 'get';
      const varName = node.data.variableName || '';

      if (!varName) {
        throw new Error('Variable name not specified');
      }

      if (action === 'get') {
        output = variables[varName] || '';
        updateNodeData(node.id, { output });
      } else {
        const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
        if (inputValue) {
          variables[varName] = inputValue;
          output = `Variable "${varName}" set to: ${inputValue}`;
          updateNodeData(node.id, { output });
        } else {
          throw new Error('No input to save to variable');
        }
      }
      
    } else if (nodeType === 'file-export') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      
      if (!inputValue) {
        throw new Error('No input connected to File Export block');
      }

      const filename = node.data.filename || 'output.txt';
      
      const blob = new Blob([inputValue], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      output = `File "${filename}" downloaded successfully`;
      updateNodeData(node.id, { output });
      
    } else if (nodeType === 'custom-block') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      const code = node.data.customCode || 'return input;';
      
      try {
        // Execute custom code safely
        const func = new Function('input', code);
        output = func(inputValue);
        updateNodeData(node.id, { output });
      } catch (error) {
        throw new Error(`Custom code error: ${error.message}`);
      }
      
    } else if (nodeType === 'output' || nodeType === 'text-output') {
      const inputValue = await getInputFromConnectedNodes(node.id, nodes, edges, false);
      output = inputValue || 'No input';
      updateNodeData(node.id, { output });
    }

    updateNodeData(node.id, { isProcessing: false });

    if (nodeType === 'conditional') {
      const downstreamEdges = edges.filter(edge => edge.source === node.id);
      for (const edge of downstreamEdges) {
        const nextNode = nodes.find(n => n.id === edge.target);
        if (nextNode) {
          if ((output === true && edge.sourceHandle === 'true') ||
              (output === false && edge.sourceHandle === 'false')) {
            await processNode(nextNode, nodes, edges, apiKeys, updateNodeData, visited, variables, customBlocks, batchItem);
          }
        }
      }
    } else {
      const downstreamEdges = edges.filter(edge => edge.source === node.id);
      for (const edge of downstreamEdges) {
        const nextNode = nodes.find(n => n.id === edge.target);
        if (nextNode) {
          await processNode(nextNode, nodes, edges, apiKeys, updateNodeData, visited, variables, customBlocks, batchItem);
        }
      }
    }

  } catch (error) {
    updateNodeData(node.id, { 
      isProcessing: false, 
      error: error.message 
    });
    throw error;
  }
}

async function getInputFromConnectedNodes(nodeId, nodes, edges, includeImages) {
  const incomingEdges = edges.filter(edge => edge.target === nodeId);
  
  if (incomingEdges.length === 0) return includeImages ? { textData: null, imageData: null } : null;

  if (includeImages) {
    let textData = null;
    let imageData = null;

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (!sourceNode) continue;

      if (sourceNode.data.type === 'image-input') {
        imageData = sourceNode.data.imageData;
      } else {
        textData = sourceNode.data.output || sourceNode.data.value || sourceNode.data.currentBatchItem || '';
      }
    }

    return { textData, imageData };
  } else {
    const sourceEdge = incomingEdges[0];
    const sourceNode = nodes.find(n => n.id === sourceEdge.source);
    
    if (!sourceNode) return null;

    return sourceNode.data.output || sourceNode.data.value || sourceNode.data.currentBatchItem || '';
  }
}

async function getAllInputsFromConnectedNodes(nodeId, nodes, edges) {
  const incomingEdges = edges.filter(edge => edge.target === nodeId);
  const inputs = [];

  for (const edge of incomingEdges) {
    const sourceNode = nodes.find(n => n.id === edge.source);
    if (sourceNode) {
      const value = sourceNode.data.output || sourceNode.data.value || sourceNode.data.currentBatchItem || '';
      if (value) inputs.push(value);
    }
  }

  return inputs;
}

function applyTextTransform(text, settings) {
  const transformType = settings.transformType || 'uppercase';

  switch (transformType) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'capitalize':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'reverse':
      return text.split('').reverse().join('');
    case 'trim':
      return text.trim();
    case 'replace':
      const findText = settings.findText || '';
      const replaceText = settings.replaceText || '';
      return text.replace(new RegExp(findText, 'g'), replaceText);
    default:
      return text;
  }
}

function parseJSON(text, jsonPath) {
  try {
    const data = JSON.parse(text);
    
    if (!jsonPath) {
      return JSON.stringify(data, null, 2);
    }

    const parts = jsonPath.split('.');
    let result = data;

    for (const part of parts) {
      const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        result = result[arrayMatch[1]][parseInt(arrayMatch[2])];
      } else {
        result = result[part];
      }

      if (result === undefined) {
        throw new Error(`Path not found: ${jsonPath}`);
      }
    }

    return typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
  } catch (error) {
    throw new Error(`JSON Parse Error: ${error.message}`);
  }
}

async function evaluateCondition(node, inputValue, apiKey) {
  const conditionType = node.data.conditionType || 'contains';
  const conditionValue = node.data.conditionValue || '';

  switch (conditionType) {
    case 'contains':
      return inputValue.toLowerCase().includes(conditionValue.toLowerCase());
    
    case 'not-contains':
      return !inputValue.toLowerCase().includes(conditionValue.toLowerCase());
    
    case 'length':
      const operator = node.data.conditionOperator || 'greater';
      const threshold = parseInt(conditionValue) || 0;
      if (operator === 'greater') {
        return inputValue.length > threshold;
      } else {
        return inputValue.length < threshold;
      }
    
    case 'sentiment':
      const sentimentPrompt = `Analyze the sentiment of this text and respond with ONLY ONE WORD: either "positive" or "negative".\n\nText: ${inputValue}`;
      const sentiment = await callOpenAI(sentimentPrompt, apiKey);
      return sentiment.toLowerCase().includes('positive');
    
    default:
      return false;
  }
}

async function callOpenAI(inputText, apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI API key not set');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: inputText
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

async function callGPT4Vision(imageData, prompt, apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI API key not set');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageData,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw new Error(`GPT-4 Vision API Error: ${error.message}`);
  }
}

async function callClaude(inputText, apiKey, model) {
  if (!apiKey) {
    throw new Error('Anthropic API key not set');
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: inputText
        }
      ],
    });

    return message.content[0].text;
  } catch (error) {
    throw new Error(`Claude API Error: ${error.message}`);
  }
}

async function callGemini(inputText, apiKey, model) {
  if (!apiKey) {
    throw new Error('Google AI API key not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model: model });

  try {
    const result = await geminiModel.generateContent(inputText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

async function callApiWebhook(url, method, body, headersJson) {
  try {
    const headers = headersJson ? JSON.parse(headersJson) : { 'Content-Type': 'application/json' };
    
    const options = {
      method: method,
      headers: headers,
    };

    if (method !== 'GET' && body) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.text();
    
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  } catch (error) {
    throw new Error(`API Webhook Error: ${error.message}`);
  }
}
