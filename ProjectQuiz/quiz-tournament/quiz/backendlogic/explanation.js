// ─── Explanation Popup ────────────────────────────────────────────────────────
// Shows the result ("Correct!" / "Incorrect!" / "Time's Up!") and the question
// explanation after each answer. Auto-advances to the next question after 4s.
// Uses the shared `explanationTimeoutId` and `activeQuestionData` from quiz.js.

function showExplanation(resultTitle) {
    const popup = document.getElementById('explanationPopup');
    const titleEl = document.getElementById('explanationText');

    titleEl.textContent = resultTitle;
    titleEl.style.color = resultTitle.includes('Correct') ? 'var(--correct-green)' : 'var(--warning-orange)';

    document.getElementById('explanationDesc').textContent = activeQuestionData.explanation;

    // Hide the manual "Next" button — we auto-advance instead
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.style.display = 'none';

    popup.classList.remove('hidden');

    // Clear any previous timeout so overlapping timers don't cause double-advances
    if (explanationTimeoutId) clearTimeout(explanationTimeoutId);
    explanationTimeoutId = setTimeout(nextQuestionFlow, 4000);
}

function nextQuestionFlow() {
    currentQuestionIndex++;
    questionsInCurrentRound++;
    loadNextQuestion();
}
