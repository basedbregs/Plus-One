# activity-logger

Auto-log every action to ACTIVITY.md with timestamp.

## When

**Always** — this skill runs automatically on every message/t action.

## How

1. **Read** current ACTIVITY.md (last 50 lines to get format)
2. **Append** new entry at top of today's section:
```
### HH:MM - Brief title
- **Action:** What happened
- **Details:** Any relevant info
```

3. **Write** back to ACTIVITY.md

## Format

- Use 24h timestamps in user's timezone (America/New_York)
- Keep entries concise but informative
- Include tokens, repo names, file paths when relevant
- User can read ACTIVITY.md anytime

## What to Log

- All file reads/writes/edits
- All exec commands
- All web searches/fetches
- All tool calls
- User requests and responses
- Errors and issues

## What NOT to Log

- Heartbeat polls (unless something meaningful)
- Session status checks
- Internal tool metadata