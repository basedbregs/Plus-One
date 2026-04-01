#!/usr/bin/env node
/**
 * MiniMax API Client
 * Usage: node minimax.mjs [options] "prompt"
 * 
 * MiniMax uses a different auth format requiring both API Key and Group ID
 * Set MINIMAX_API_KEY and MINIMAX_GROUP_ID environment variables
 * 
 * Options:
 *   --model <name>     Model to use (default: MiniMax-Text-01)
 *   --system <text>    System prompt
 *   --json             Output raw JSON
 */

const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;

// MiniMax uses Group ID in the URL path
const BASE_URL = 'https://api.minimax.chat';
const API_URL = GROUP_ID 
  ? `${BASE_URL}/v1/text/chatcompletion_v2?GroupId=${GROUP_ID}`
  : `${BASE_URL}/v1/text/chatcompletion_v2`;

if (!API_KEY) {
  console.error('Error: MINIMAX_API_KEY environment variable not set');
  process.exit(1);
}

if (!GROUP_ID) {
  console.error('Warning: MINIMAX_GROUP_ID not set. Trying without Group ID...');
}

// Parse arguments
const args = process.argv.slice(2);
let model = 'MiniMax-Text-01';
let systemPrompt = null;
let jsonOutput = false;
let userPrompt = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--model' && i + 1 < args.length) {
    model = args[++i];
  } else if (args[i] === '--system' && i + 1 < args.length) {
    systemPrompt = args[++i];
  } else if (args[i] === '--json') {
    jsonOutput = true;
  } else if (!userPrompt && !args[i].startsWith('--')) {
    userPrompt = args[i];
  }
}

if (!userPrompt) {
  console.error('Usage: node minimax.mjs [options] "prompt"');
  console.error('Options:');
  console.error('  --model <name>     Model to use (default: MiniMax-Text-01)');
  console.error('  --system <text>    System prompt');
  console.error('  --json             Output raw JSON');
  process.exit(1);
}

// Build messages
const messages = [];
if (systemPrompt) {
  messages.push({ role: 'system', content: systemPrompt });
}
messages.push({ role: 'user', content: userPrompt });

// Build request body
const body = {
  model: model,
  messages: messages
};

// Make request
async function callMiniMax() {
  try {
    // MiniMax auth: try Bearer first, then alternative formats
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Try different auth formats
    if (API_KEY.startsWith('sk-api-')) {
      // Legacy format - might need different handling
      headers['Authorization'] = API_KEY;
    } else {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (jsonOutput) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    // Check for errors
    if (data.base_resp && data.base_resp.status_code !== 0) {
      console.error(`Error ${data.base_resp.status_code}: ${data.base_resp.status_msg}`);
      process.exit(1);
    }

    // Extract response text
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log(data.choices[0].message.content);
    } else {
      console.error('Unexpected response format:', JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    process.exit(1);
  }
}

callMiniMax();
