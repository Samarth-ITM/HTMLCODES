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

## Future Enhancements
- Add more questions and categories
- Implement a timer bar visual
- Add sound effects for correct/wrong answers and powerups
- Make it mobile responsive
- Add animations for transitions between screens
- Implement a more robust anti-cheat system (e.g. webcam monitoring, IP tracking)
- Add user authentication and backend storage for a real multiplayer experience 
- Implement different question types (e.g. true/false, fill in the blank)
- Add more powerups and strategic elements (e.g. skip question, steal points)
- Create a more polished UI with better visuals and animations
- Add a practice mode for players to try out questions without affecting their tournament score
- Implement a "spectator mode" where non-players can watch the tournament progress in real-time
- Add support for multiple simultaneous tournaments with different themes/categories
- Implement a referral system to encourage players to invite friends
- Add a "Hall of Fame" page showcasing past champions and their scores
- Implement a more detailed player profile page with stats, past performance, and earned badges/trophies
- Add a "challenge a friend" feature where players can directly compete against friends in a mini
- Implement a more robust forum with categories, upvoting, and moderation features
- Add support for multiple languages and localization
- Implement a more secure billing system with real payment processing for the Go Pro and Select Plan options
