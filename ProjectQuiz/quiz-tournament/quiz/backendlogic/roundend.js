// ─── Round End & Tournament End ───────────────────────────────────────────────
// Everything that happens after the last question of a round is answered:
// show pass/fail modal, auto-countdown to next action, champion screen,
// save score, redirect to leaderboard.
//
// Also contains saveToForum() which is called from quiz.js on correct answers.
// Uses shared state from quiz.js: `rounds`, `currentRoundIndex`, `roundScore`,
// `score`, `correctCount`, `totalQuestionsAnswered`, `player`.


// ─── finishRound ──────────────────────────────────────────────────────────────
// Called when the last question of a round is done.
// Decides pass/fail and whether this was the final round.

function finishRound() {
    const roundDetails = rounds[currentRoundIndex];
    document.getElementById('quizContainer').classList.add('hidden');
    const modal = document.getElementById('resultModal');
    document.getElementById('resultScore').textContent = roundScore;

    const playerPassed = roundScore >= roundDetails.minScore;
    const isLastRound = currentRoundIndex === rounds.length - 1;

    if (playerPassed && isLastRound) {
        // Player won the whole tournament — show the champion screen
        const finalAccuracy = Math.round((correctCount / totalQuestionsAnswered) * 100);
        document.getElementById('champName').textContent = player.name;
        document.getElementById('champId').textContent = player.id;
        document.getElementById('champScore').textContent = score;
        document.getElementById('champAccuracy').textContent = finalAccuracy;
        modal.classList.add('hidden');
        document.getElementById('championScreen').classList.remove('hidden');
        document.getElementById('champDashboardBtn').onclick = () => endTournament(true);
        return;
    }

    if (playerPassed) {
        // Passed this round — show "Next Round" with countdown
        document.getElementById('resultTitle').textContent = `${roundDetails.name} Passed!`;
        document.getElementById('resultMessage').textContent = `Required: ${roundDetails.minScore}. You got: ${roundScore}.`;
        modal.classList.remove('hidden');
        const nextBtn = document.getElementById('nextRoundBtn');
        nextBtn.classList.remove('hidden');
        startCountdownButton(nextBtn, 'Next Round', () => advanceRound(modal, nextBtn));
    } else {
        // Failed this round — show "Finish" with countdown
        document.getElementById('resultTitle').textContent = 'Round Failed!';
        document.getElementById('resultMessage').textContent = `Required: ${roundDetails.minScore}. You got: ${roundScore}.`;
        modal.classList.remove('hidden');
        const finishBtn = document.getElementById('retryBtn');
        finishBtn.classList.remove('hidden');
        startCountdownButton(finishBtn, 'Finish', () => closeAndEnd(modal, finishBtn));
    }
}


// ─── startCountdownButton ─────────────────────────────────────────────────────
// Puts a live "Label (5s)…" countdown on a button, then fires `action`.
// If the player clicks before the countdown ends, fires immediately.

function startCountdownButton(btn, label, action) {
    let secondsLeft = 5;
    let alreadyFired = false;
    btn.textContent = `${label} (${secondsLeft}s)`;

    const countdownInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            btn.textContent = `${label} (${secondsLeft}s)`;
        } else if (!alreadyFired) {
            alreadyFired = true;
            clearInterval(countdownInterval);
            action();
        }
    }, 1000);

    btn.onclick = () => {
        if (!alreadyFired) {
            alreadyFired = true;
            clearInterval(countdownInterval);
            action();
        }
    };
}

function advanceRound(modal, btn) {
    modal.classList.add('hidden');
    btn.classList.add('hidden');
    currentRoundIndex++;
    showBracket();
}

function closeAndEnd(modal, btn) {
    modal.classList.add('hidden');
    btn.classList.add('hidden');
    endTournament(false);
}


// ─── endTournament ────────────────────────────────────────────────────────────
// Saves the player's best score and redirects to the leaderboard.

function endTournament(isWin) {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    const finalAccuracy = totalQuestionsAnswered > 0
        ? Math.round((correctCount / totalQuestionsAnswered) * 100)
        : 0;

    if (score > player.bestScore) {
        player.bestScore = score;
        player.bestAccuracy = finalAccuracy;
    }

    saveCurrentPlayer(player);
    updateLeaderboard(player, finalAccuracy);
    window.location.href = '../leaderboard/leaderboard.html';
}


// ─── saveToForum ──────────────────────────────────────────────────────────────
// Adds a correctly-answered question to the forum store (once per unique question).

function saveToForum(questionObj) {
    const forum = JSON.parse(localStorage.getItem('forumComments')) || [];
    const alreadyExists = forum.some(entry => entry.id === questionObj.id);
    if (!alreadyExists) {
        forum.push({ ...questionObj, comments: [] });
        localStorage.setItem('forumComments', JSON.stringify(forum));
    }
}
