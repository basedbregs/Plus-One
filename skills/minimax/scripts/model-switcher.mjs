#!/usr/bin/env node
/**
 * Model Switcher for OpenClaw
 * Allows switching between default model and MiniMax on demand
 * 
 * Usage from OpenClaw:
 * - "use minimax" -> sets context to use MiniMax
 * - "use default" -> returns to default model
 * - "ask minimax: <question>" -> one-off query to MiniMax
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_FILE = path.join(__dirname, '..', '.model-state.json');

// Available models
const MODELS = {
  default: { name: 'Default', type: 'openclaw' },
  minimax: { name: 'MiniMax-Text-01', type: 'minimax', script: path.join(__dirname, 'minimax.mjs') },
  xai: { name: 'xAI/Grok', type: 'api', env: 'XAI_API_KEY' },
  openai: { name: 'OpenAI', type: 'api', env: 'OPENAI_API_KEY' }
};

function getState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { current: 'default' };
  }
}

function setState(model) {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ current: model, timestamp: Date.now() }, null, 2));
  console.log(`✓ Switched to ${MODELS[model]?.name || model}`);
}

function getCurrentModel() {
  return getState().current;
}

function queryMiniMax(prompt) {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    console.error('Error: MINIMAX_API_KEY not set');
    process.exit(1);
  }
  
  try {
    const result = execSync(`node "${MODELS.minimax.script}" "${prompt.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8',
      env: process.env
    });
    return result.trim();
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (command === 'switch' && args[1]) {
  const model = args[1];
  if (!MODELS[model]) {
    console.error(`Unknown model: ${model}`);
    console.error(`Available: ${Object.keys(MODELS).join(', ')}`);
    process.exit(1);
  }
  setState(model);
} else if (command === 'current') {
  console.log(getCurrentModel());
} else if (command === 'query' && args[1]) {
  const prompt = args.slice(1).join(' ');
  const current = getCurrentModel();
  
  if (current === 'minimax') {
    console.log(queryMiniMax(prompt));
  } else {
    console.log(`Current model is ${MODELS[current]?.name}. Use "switch minimax" first or specify model.`);
  }
} else if (command === 'ask' && args[1] && args[2]) {
  const model = args[1];
  const prompt = args.slice(2).join(' ');
  
  if (model === 'minimax') {
    console.log(queryMiniMax(prompt));
  } else {
    console.log(`Direct query for ${model} not implemented in this wrapper.`);
  }
} else {
  console.log('Model Switcher for OpenClaw');
  console.log('');
  console.log('Commands:');
  console.log('  switch <model>     Switch to a model (default, minimax, xai, openai)');
  console.log('  current            Show current model');
  console.log('  query <prompt>     Query current model');
  console.log('  ask <model> <prompt>  One-off query to specific model');
  console.log('');
  console.log('Current model:', getCurrentModel());
}
