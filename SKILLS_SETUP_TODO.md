# 🔧 OpenClaw Skills & API Setup TODO

## Priority 1: Coding Agents (Claude Code, xAI, Grok)

### Claude Code
- [ ] Install Claude Code CLI: `npm install -g @anthropic-ai/claude-code`
- [ ] Authenticate: `claude auth login`
- [ ] Test: `claude --version`
- [ ] Skill already installed: `coding-agent` ✓

### xAI (Grok)
- [ ] Get xAI API key from https://x.ai/api
- [ ] Set environment variable: `XAI_API_KEY`
- [ ] Skill already installed: `summarize` (supports xAI models) ✓
- [ ] Optional: Install xAI CLI if available

### Minimax (Agentic Model - Interchangeable) ⚠️ API KEY ISSUE
- [x] Skill created: `skills/minimax/`
- [x] Model switcher: `skills/minimax/scripts/model-switcher.mjs`
- [x] Group ID saved: `2035490285936448416`
- [x] API keys tested: Both failed with status 1004 "login fail"
- [ ] **Root Cause**: MiniMax API rejecting `sk-api-` format keys
  - [ ] **Solution 1**: Generate NEW key at https://www.minimaxi.com/user-center/basic-information/interface
  - [ ] **Solution 2**: Keys may need activation in console first
  - [ ] **Solution 3**: Try international API endpoint if available

**Tested:**
- Endpoint: `api.minimax.chat` and `api.minimaxi.com`
- With/without Bearer prefix
- With Group ID in URL
- All return: `{"status_code":1004,"status_msg":"login fail"}`

**To Fix:**
1. Log in to https://www.minimaxi.com/ (new console)
2. Go to User Center → API Management
3. Get your **Group ID** (numeric) and **API Key**
4. Set both:
   ```bash
   export MINIMAX_GROUP_ID="1234567890"
   export MINIMAX_API_KEY="sk-..."
   ```

**Usage (once fixed):**
```bash
node skills/minimax/scripts/minimax.mjs "Your prompt"
node skills/minimax/scripts/model-switcher.mjs switch minimax
```

### Additional Coding Tools
- [ ] Install Codex (optional): `npm install -g @openai/codex`
- [ ] Install OpenCode (optional): `npm install -g opencode`

---

## Priority 2: Social Media & APIs

### X (Twitter) - xurl
- [ ] Install xurl: `npm install -g @xdevplatform/xurl`
- [ ] Or via brew: `brew install --cask xdevplatform/tap/xurl`
- [ ] Register app at https://developer.x.com/en/portal/dashboard
- [ ] Authenticate: `xurl auth oauth2`
- [ ] Test: `xurl whoami`
- [ ] Skill already installed: `xurl` ✓

### Reddit ✅ INSTALLED
- [x] **Found on ClawHub**: `reddit` skill installed
- [x] Location: `~/.openclaw/workspace/skills/reddit/`
- [ ] **For read-only use** (browse, search) - works immediately, no auth needed
- [ ] **For posting/moderation** - requires OAuth setup:
  - [ ] Go to https://www.reddit.com/prefs/apps
  - [ ] Click "create another app..."
  - [ ] Select "script" type
  - [ ] Name: "OpenClaw Reddit"
  - [ ] Redirect URI: `http://localhost:8080`
  - [ ] Get client ID (under the app name) and secret
  - [ ] Set env vars:
    ```bash
    export REDDIT_CLIENT_ID=""
    export REDDIT_CLIENT_SECRET=""
    export REDDIT_USERNAME=""
    export REDDIT_PASSWORD=""
    ```

**Usage Examples:**
```bash
# Read hot posts from a subreddit
node skills/reddit/scripts/reddit.mjs posts wallstreetbets

# Search Reddit
node skills/reddit/scripts/reddit.mjs search all "stock picks"

# Get comments on a post
node skills/reddit/scripts/reddit.mjs comments POST_ID

# Submit a post (requires auth)
node skills/reddit/scripts/reddit.mjs submit yoursubreddit --title "Title" --text "Body"
```

---

## Priority 3: Already Installed Skills (Verify/Configure)

### GitHub
- [ ] Install GitHub CLI: `gh auth login`
- [ ] Verify: `gh auth status`
- [ ] Skill: `github` ✓

### Discord
- [ ] Configure in OpenClaw: `channels.discord.token`
- [ ] Skill: `discord` ✓

### Slack
- [ ] Configure in OpenClaw: `channels.slack`
- [ ] Skill: `slack` ✓

### Notion
- [ ] Create integration at https://notion.so/my-integrations
- [ ] Get API key (starts with `ntn_` or `secret_`)
- [ ] Store: `~/.config/notion/api_key`
- [ ] Skill: `notion` ✓

### Trello
- [ ] Get API key: https://trello.com/app-key
- [ ] Generate token
- [ ] Set env vars: `TRELLO_API_KEY`, `TRELLO_TOKEN`
- [ ] Skill: `trello` ✓

### Spotify
- [ ] Install spogo: `brew install steipete/tap/spogo`
- [ ] Import cookies: `spogo auth import --browser chrome`
- [ ] Or use spotify_player: `brew install spotify_player`
- [ ] Skill: `spotify-player` ✓

### Obsidian
- [ ] Install obsidian-cli: `brew install yakitrak/yakitrak/obsidian-cli`
- [ ] Set default vault: `obsidian-cli set-default "<vault-name>"`
- [ ] Skill: `obsidian` ✓

### Gemini
- [ ] Install: `brew install gemini-cli`
- [ ] Authenticate: `gemini` (interactive)
- [ ] Skill: `gemini` ✓

### OpenAI Image Gen
- [ ] Set env var: `OPENAI_API_KEY`
- [ ] Skill: `openai-image-gen` ✓

### Summarize.sh
- [ ] Install: `brew install steipete/tap/summarize`
- [ ] Set API keys for preferred providers:
  - [ ] OpenAI: `OPENAI_API_KEY`
  - [ ] xAI: `XAI_API_KEY`
  - [ ] Anthropic: `ANTHROPIC_API_KEY`
  - [ ] Google: `GEMINI_API_KEY`
- [ ] Skill: `summarize` ✓

---

## Priority 4: Additional Useful Skills

### 1Password
- [ ] Install 1Password CLI: `brew install 1password-cli`
- [ ] Sign in: `op signin`
- [ ] Skill: `1password` ✓

### Blogwatcher (RSS)
- [ ] Install: `go install github.com/Hyaxia/blogwatcher/cmd/blogwatcher@latest`
- [ ] Add blogs: `blogwatcher add "Blog Name" https://example.com/feed`
- [ ] Skill: `blogwatcher` ✓

### Sonos
- [ ] Install: `npx clawhub@latest install sonoscli`
- [ ] Or: `clawhub install sonoscli`
- [ ] Skill: `sonoscli` ✓

### Canvas (LMS)
- [ ] Check if needed for school/work
- [ ] Skill: `canvas` ✓

---

## Priority 2.5: Brave Search API

### Brave Search
- [ ] Get API key from https://brave.com/search/api/
- [ ] Configure OpenClaw: `openclaw configure --section web`
- [ ] Or set env var: `BRAVE_API_KEY`
- [ ] **Note**: No dedicated skill needed - built into OpenClaw's `web_search` tool
- [ ] Test: `web_search query:"test search"`

---

## Priority 5: Search for More Skills on ClawHub

Run these commands to find more skills:

```bash
# Search for specific skills
clawhub search reddit
clawhub search youtube
clawhub search gmail
clawhub search calendar
clawhub search photos
clawhub search homekit
clawhub search homeassistant
clawhub search aws
clawhub search docker
clawhub search kubernetes
clawhub search postgres
clawhub search mysql
clawhub search mongodb

# List all available skills
clawhub list
```

---

## Environment Variables Summary

Create a file at `~/.openclaw/.env` or add to your shell profile:

```bash
# AI APIs
export OPENAI_API_KEY=""
export ANTHROPIC_API_KEY=""
export XAI_API_KEY=""
export GEMINI_API_KEY=""
export MINIMAX_API_KEY="sk-..."  # Agentic model - interchangeable

# Social Media
export XURL_DEFAULT_APP=""  # xurl app name

# Reddit
export REDDIT_CLIENT_ID=""
export REDDIT_CLIENT_SECRET=""
export REDDIT_USERNAME=""
export REDDIT_PASSWORD=""
export REDDIT_USER_AGENT="OpenClawBot/1.0 by u/yourusername"

# Productivity
export NOTION_API_KEY=""
export TRELLO_API_KEY=""
export TRELLO_TOKEN=""

# Web Search
export BRAVE_API_KEY=""  # Required for web_search tool
export FIRECRAWL_API_KEY=""  # For summarize.sh fallback
export APIFY_API_TOKEN=""  # For YouTube fallback in summarize
```

---

## Quick Start Commands

```bash
# 1. Install ClawHub CLI
npm install -g clawhub

# 2. Search for skills
clawhub search <keyword>

# 3. Install a skill
clawhub install <skill-name>

# 4. Update all skills
clawhub update --all

# 5. List installed skills
clawhub list
```

---

## Notes

- **ClawHub**: https://clawhub.ai - Browse and install skills
- **OpenClaw Docs**: https://docs.openclaw.ai
- **Skills Location**: `~/AppData/Roaming/npm/node_modules/openclaw/skills/`
- **Custom Skills**: Can be created in workspace `skills/` folder

## Reddit Skill Gap

**Important**: No official Reddit skill exists yet. Options:
1. Use `web_fetch` to read Reddit pages directly (limited)
2. Create a custom skill using PRAW
3. Use Reddit's JSON API: `https://www.reddit.com/r/subreddit.json`
4. Check if someone publishes one to ClawHub

---

*Created: 2026-03-22*
*Next Review: After initial setup*
