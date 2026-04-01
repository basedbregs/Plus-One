---
name: minimax
description: Interact with MiniMax AI models for agentic tasks, reasoning, and complex workflows. Supports MiniMax-Text-01 and MiniMax-VL-01 models.
metadata:
  {
    "openclaw":
      {
        "emoji": "🧠",
        "requires": { "bins": ["curl", "node"], "env": ["MINIMAX_API_KEY"] },
        "primaryEnv": "MINIMAX_API_KEY",
      },
  }
---

# MiniMax Skill

Use MiniMax models as an interchangeable agentic model for complex reasoning and tasks.

## Setup

MiniMax uses a **Group ID + API Key** authentication system.

### Get Your Credentials
1. Log in to https://www.minimaxi.com/ (new) or https://www.minimax.chat/ (legacy)
2. Go to User Center → API Keys
3. Copy your **Group ID** (starts with numbers)
4. Copy your **API Key** (starts with `sk-`)

### Set Environment Variables
```bash
export MINIMAX_GROUP_ID="1234567890"  # Your numeric Group ID
export MINIMAX_API_KEY="sk-..."       # Your API key
```

### Alternative: Legacy Key Format
If your key starts with `sk-api-`, it may be a legacy key that requires different authentication. Contact MiniMax support or regenerate your key in the new console.

## Usage

### Quick Chat
```bash
node {baseDir}/scripts/minimax.mjs "Your prompt here"
```

### With System Prompt
```bash
node {baseDir}/scripts/minimax.mjs --system "You are an expert coder" "Write a Python function"
```

### Switch Models
```bash
node {baseDir}/scripts/minimax.mjs --model MiniMax-VL-01 "Describe this image"
```

### From OpenClaw
When you want me to use MiniMax instead of my default model, say "use minimax" or "switch to minimax".

## Models

- `MiniMax-Text-01` (default) - General purpose, agentic capabilities
- `MiniMax-VL-01` - Vision-language model

## Notes

- MiniMax excels at agentic workflows and complex reasoning
- Use interchangeably with other models based on task needs
