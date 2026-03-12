# Quiz Tournament 🏆

A gamified multi-round quiz tournament built with plain HTML, CSS, and JavaScript. No frameworks, no backend — everything runs in the browser using `localStorage`.

---

## How it Works

Players register with a name and get a unique ID (e.g. `P3024`), then pass through a rules/start screen before competing through 4 elimination rounds (Round 1 → Quarterfinal → Semifinal → Final). Each round has a minimum score threshold to advance. Scores are saved to a leaderboard and the forum is open for registered players to discuss.

---

## User Flow

```
index.html  →  register/register.html  →  quiz/start.html  →  quiz/quiz.html  →  leaderboard/leaderboard.html
                                            (rules + gate)      (tournament)
```

---

## Features

- **Registration** — Enter a name, get a random player ID, limited to 3 total attempts
- **Start gate** — Rules screen that checks attempt count and blocks ineligible players before the tournament begins
- **Multi-round tournament** — 4 rounds, each with a minimum score threshold to advance
- **Timed questions** — 10 seconds per question, score decreases the longer you take (max 1000, min 500)
- **Powerups** — 50/50, Time Boost (+10s), Immunity (no penalty on wrong answer), Redemption (double points or double penalty)
- **Explanation popups** — After every answer, a brief explanation is shown before advancing
- **Anti-cheat** — Fullscreen lock on start, tab-switch detection (2 warnings = disqualified), right-click and copy disabled
- **Leaderboard** — Top 10 scores with medals for top 3
- **Forum** — Discussion thread where any registered player can leave a comment
- **Billing** — Dedicated checkout pages for Go Pro (monthly) and Select Plan (one-time host)

---

## File Structure

```
quiz-tournament/
├── index.html              # Landing page
├── base.js                 # Shared utils: getCurrentPlayer, saveCurrentPlayer, updateLeaderboard
├── base.css                # CSS tokens (:root), box-sizing reset, bare body styles
├── landing.css             # Landing page styles
├── fix.js                  # Landing page CTA update if a player is already registered
│
├── data/
│   └── questions.json      # Question bank
│
├── assets/
│   └── landing/            # Landing page images/icons
│
├── register/
│   ├── register.html
│   ├── register.css
│   └── register.js         # Generates player ID, saves to localStorage, redirects to start.html
│
├── quiz/
│   ├── start.html          # Entry gate: shows rules, checks attempt eligibility
│   ├── start.css
│   ├── quiz.html           # Tournament: bracket → questions → round modal → champion screen
│   ├── quiz.css
│   ├── quiz.js             # Core orchestrator: state, round/question loading, scoring, rendering
│   └── backendlogic/
│       ├── timer.js        # startTimer(), updateTimerDisplay(), handleTimeOut()
│       ├── explanation.js  # showExplanation(), nextQuestionFlow()
│       ├── powerups.js     # resetPowerupState(), activatePowerupDock()
│       └── roundend.js     # finishRound(), advanceRound(), endTournament(), saveToForum()
│
├── dashboard/
│   ├── dashboard.html
│   ├── dashboard.css
│   └── dashboard.js
│
├── leaderboard/
│   ├── leaderboard.html
│   ├── leaderboard.css
│   └── leaderboard.js
│
├── forum/
│   ├── forum.html
│   ├── forum.css
│   └── forum.js
│
└── billing/
    ├── gopro.html          # Checkout page for Go Pro (monthly, ₹2000)
    ├── gopro.css
    ├── gopro.js
    ├── selectplan.html     # Checkout page for One-Time Host (₹50)
    ├── selectplan.css
    └── selectplan.js
```

---

## quiz.html Screens

`quiz.html` contains 5 screens stacked in the DOM. Only one is visible at a time — JS swaps the `.hidden` class.

| Screen | ID | Shown when |
|---|---|---|
| Bracket overview | `#bracketScreen` | Round starts |
| Question | `#quizContainer` | Player is answering |
| Round result modal | `#resultModal` | Round ends (pass or fail) |
| Champion screen | `#championScreen` | Player wins the final |

---

## localStorage Schema

| Key | What it stores |
|---|---|
| `currentPlayer` | `{ name, id, bestScore, attemptsUsed, latestReport }` |
| `leaderboard` | Array of top 10 players `[{ name, id, score, accuracy }]` |
| `forumDiscussion` | Array of discussion posts `[{ id, author, text, timestamp, comments: [] }]` |

---

## Running Locally

The app uses `fetch()` to load `questions.json`, which browsers block over `file://`. You need a local server.

**VS Code — Live Server extension:**
1. Install the Live Server extension
2. Right-click `index.html` → Open with Live Server

**Terminal:**
```bash
# Node
npx http-server .

# Python
python3 -m http.server
```
Then open `http://localhost:8080` in your browser.














## 🆕 Recent Updates & Fixes (Constraint Compliance)
The following critical features and fixes have been recently implemented to fully satisfy the problem statement requirements:

### ✨ Match Reporting & CSV Exports
- **Comprehensive participant report**: Upgraded the `renderReport()` functionality in both `leaderboard.js` and `forum.js`. Previously displaying only incorrect answers, it now maps **all** questions faced by the user during the tournament, alongside their total match score.
- **CSV Data Integrity**: Maintained full compliance with the CSV download reporting feature, ensuring all raw participant data is easily exportable.

### 🛡️ Security & Formatting Fixes (HTML Escaping)
- **Raw HTML Rendering Bug Fix**: Prevented raw data strings (like `<video>`) from breaking DOM rendering by accidentally being processed as HTML elements.
- **Sanitization Strategy**: Successfully introduced global `escapeHTML()` regex formatters (`replace(/</g, '&lt;')`) into leaderboard and forum innerHTML generators to securely render code-based correct answers.

### 💳 Simulated Billing & Checkout Funnel
- **Dynamic Routing**: Activated the dormant premium capability tiers ("One-Time Host" & "Monthly Pro") in the `index.html` file, mapping them via URL query parameters (`?plan=host` and `?plan=pro`).
- **Billing Architecture**: Successfully scaffolded a standalone fake checkout infrastructure (`billing/billing.html`, `billing.css`, `billing.js`).
- **Checkout Simulation**: Engineered standard front-end format masking (credit card spacing), dynamic pricing displays reading from `URLSearchParams`, and a simulated timeout verification state concluding in a functional Success Modal.

### 🎨 UI/UX Improvements
- **Powerup Tooltips**: Re-engineered the UI in the primary landing page to explicitly outline the core powerup logic ("2x Double Points", "50/50", "Immunity") tightly formatted via a responsive Flexbox design constraint in `landing.css`.
- **Match Sequence Unblocking**: Diagnosed and repaired a hard-lock UI collision in `quiz/quiz.js` where the result modal improperly rendered over the champion winning screen, completely fixing the `finishRound()` end-game execution block.
