// ─── Powerups ─────────────────────────────────────────────────────────────────
// Four powerups available once per tournament (buttons in the powerup dock).
//   50/50       — hides two wrong answers
//   Immunity    — next wrong answer costs no points
//   Time Boost  — adds 10 seconds to the current timer
//   Redemption  — doubles points on correct, penalises on wrong
//
// Uses shared state: `immunityActive`, `redemptionActive`, `timeLeft`,
// `activeQuestionData` — all declared in quiz.js.

// Reset powerup flags at the start of each question
// (buttons stay disabled once used; flags reset so they don't carry over)
function resetPowerupState() {
    immunityActive = false;
    redemptionActive = false;
}

// Called by the onclick handlers on the powerup dock buttons in quiz.html
function activatePowerupDock(type) {
    if (type === '50-50') {
        // Hide two wrong answers (that aren't already faded)
        const wrongBtns = Array.from(document.querySelectorAll('.option-btn'))
            .filter(btn => btn.textContent !== activeQuestionData.answer && !btn.classList.contains('faded'));
        if (wrongBtns.length >= 2) {
            wrongBtns[0].classList.add('faded');
            wrongBtns[1].classList.add('faded');
        }
        document.getElementById('pu-5050').disabled = true;

    } else if (type === 'Immunity') {
        immunityActive = true;
        document.getElementById('pu-immunity').disabled = true;

    } else if (type === 'Time Boost') {
        timeLeft += 10;
        updateTimerDisplay();
        document.getElementById('pu-time').disabled = true;

    } else if (type === 'Redemption') {
        redemptionActive = true;
        document.getElementById('pu-redemption').disabled = true;
    }
}
