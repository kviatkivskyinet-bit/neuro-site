---
name: shift-handoff
description: Creates or updates a comprehensive handoff file (HANDOFF.md) that passes a complete, truthful, and verified project state to the next agent — a "changing of the guard". Be sure to use this skill whenever the user says "зміна караула", "передай пост", "змінюємо караул", "здай зміну", "здай вахту", "передай справи", "хендофф", "handoff", "shift change", "change of guard", "hand over", "pass the baton", or any other phrase meaning the current agent is finishing its shift and must hand the next agent a full and verified account of what was done, the current state, and what was planned but left undone. Trigger even if the user does not name the file explicitly — the intent is handing over the post.
---

# Shift Handoff (Changing of the Guard)

You are a sentry going off duty. Before you "go and rest", you must hand the next agent a **complete, truthful, and verified** picture: what was done since the last shift, the exact current state of the project, and what was planned but — for any reason — left undone. The next agent starts with zero conversation context, so this file must be sufficient for them to continue without losing ground.

Guiding principle: **it is better to admit a screw-up than to dress up the report.** The next agent (and the user) rely on this file. A silenced bug or an invented "success" costs far more than an honest "didn't get to it / broken / not verified". Write the file in the language the user works in (match their language, e.g. Ukrainian if they speak Ukrainian) — this file is for them and the next agent, not a spec document.

## Where to write

The handoff file is `HANDOFF.md` in the root of the current project (the directory you are working in). One project, one `HANDOFF.md`. In a monorepo with sub-projects, if that is how the work is organized, keep a `HANDOFF.md` in the root of each sub-project.

The file is **living and cumulative**: the top always holds the current state (rewritten every time), and below it a log of every shift change (new entries added on top, old ones **never deleted**). This way the next agent sees "where we are now" in 30 seconds and can scroll into history if needed.

## Process (follow this order)

### 1. Find the point of reference
Read the existing `HANDOFF.md` if present. From the last log entry take the timestamp and, if recorded, the last commit of the previous shift — this is the boundary for "since the last shift change". If there is no file, this is the first shift: the reference point is the start of the project's history (the first commit, or whatever data exists).

### 2. Gather facts — and verify them, don't paraphrase
Do not rely on the conversation's memory. Put hard evidence under every claim:

- **Git:** `git log --oneline <last-timestamp>..HEAD` (or by date), `git status`, `git diff --stat`. This is the backbone of the "what was done" section.
- **Uncommitted work:** whatever sits uncommitted/unpushed in the working tree is a loss risk — always flag it.
- **Build/tests/lint:** if the project has them, **run them** (build, tests, lint) and record the real result. Not "should pass", but "passed / failed here".
- **TODO / plans:** search the code for `TODO`, `FIXME`, `HACK`, open tasks, comments; cross-check the session's task list if one exists.
- **Conversation:** re-read what the user asked for and what corrections they made — that is where the undone and deferred items come from.

For every fact, hold its status in mind: **verified** (there is evidence — command output, a line of code, a commit) or **unverified** (an assumption). This distinction must be visible in the file.

### 3. Rewrite the top sections (overwrite) and add a log entry (append)
Rewrite the "Current State", "Active plans / not done", and "Screw-ups, debt, risks" blocks so they reflect the state **right now**. Then add a **new entry at the top of the log**. Do not touch older log entries.

### 4. Do not lie about verification
If you did not verify something (no time, could not run it, no access) — say exactly that in the "Verification" section: "NOT verified: X, reason Y". This is not a weakness of the report; it is its value.

### 5. Save, show the user, commit if appropriate
Write the file. Give the user a short (5–8 line) report of the essence of the handoff. If the project convention is to commit such files, offer to commit `HANDOFF.md` so it reaches the next session/device — especially in cloud sessions where the local working tree is ephemeral.

## File structure

Follow this template. The top sections (above the `---`) are rewritten each time; the log grows. Write the content in the user's language; the labels below are a guide, not a mandate.

```markdown
# 🛡 HANDOFF — <project name>

> Living handoff file. Top = current state. Below = shift-change log (newest on top).
> Last updated: <YYYY-MM-DD HH:MM TZ> · Shift handed off by: <agent/session> · Commit: <hash>

## 🟢 Current state
Concise but exhaustive: what this project is, what stage it is at, what works now, what is broken.
Branch: <branch> · Last commit: <hash "message"> · Build: <ok/failed> · Tests: <N passed / M failed / not run>

## 🎯 Active plans / not done
List of what is planned but unfinished. For each item:
- **[Priority]** Description · why not done · where we stopped (file:line) · concrete next step.

## 🕳 Screw-ups, debt, and findings
Honest and direct. Things the next agent must know to avoid the same rakes:
- **Screw-up:** what went wrong / what we broke and did not fix.
- **Tech debt:** temporary decisions, crutches, "refactor later".
- **Finding:** a surprise, an important detail, a landmine in the project.
- **Risk:** uncommitted/unpushed work, fragile spots, external dependencies.

## ✅ Verification (what was checked and how)
- Verified: <fact> — evidence: <command / output / commit>.
- NOT verified: <fact> — reason: <no time / no access / broken environment>.

---

## 🗂 Shift-change log

### 🔁 <YYYY-MM-DD HH:MM TZ> — handed off by <agent/session>
- **Done since last shift (<previous timestamp / commit>):**
  - ... (with references to commits/files)
- **State at handoff:** ...
- **Not done / deferred:** ... (why)
- **Screw-ups and findings:** ...
- **Verified / not verified:** ...

<!-- ↑ add new entries here, never delete old ones ↓ -->
```

## Example of one log entry

```markdown
### 🔁 2026-07-01 14:20 EEST — handed off by claude/web-session
- **Done since last shift (2026-06-30 18:00, commit a1b2c3d):**
  - Added login form validation (commit e4f5g6h, `src/auth/login.ts`).
  - Fixed crash on empty email (commit i7j8k9l).
- **State at handoff:** branch `feature/auth`, build OK, tests 18 passed / 2 failed.
- **Not done / deferred:** OAuth integration — blocked on a key the user hasn't provided; stopped at `src/auth/oauth.ts:42`.
- **Screw-ups and findings:** 2 tests in `auth.test.ts` fail due to a date mock — NOT fixed, looks like a timezone issue. Finding: the project has two different http clients, easy to confuse.
- **Verified / not verified:** ran build and tests myself (`npm test`); OAuth flow NOT verified — no key.
```

## What to avoid
- Don't write "everything works" if you didn't run it. An empty verification is worse than an honest "not verified".
- Don't delete or rewrite old log entries — that erases the project's history.
- Don't pad it out: the next agent needs the exact state and next steps, not a replay of every keystroke.
- Don't invent plan items that were never part of the work or the user's requests.
