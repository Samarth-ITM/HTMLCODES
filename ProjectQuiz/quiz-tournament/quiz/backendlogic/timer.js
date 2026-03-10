// ─── Timer ────────────────────────────────────────────────────────────────────
// Handles the 10-second countdown for each question.
// Uses the shared `timeLeft` and `timerInterval` variables from quiz.js.

function startTimer() {
    timeLeft = 10;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timeDisplay').textContent = timeLeft;
    // Turn the timer badge red when 3 seconds or fewer remain
    document.getElementById('timerBadge').classList.toggle('danger', timeLeft <= 3);
}

// Called when the timer hits zero — mark buttons and move on
function handleTimeOut() {
    const allOptionBtns = Array.from(document.querySelectorAll('.option-btn'));
    allOptionBtns.forEach(btn => {
        btn.disabled = true;
        btn.classList.add(btn.textContent === activeQuestionData.answer ? 'correct' : 'faded');
    });
    totalQuestionsAnswered++;
    showExplanation("Time's Up! ⏳");
}
