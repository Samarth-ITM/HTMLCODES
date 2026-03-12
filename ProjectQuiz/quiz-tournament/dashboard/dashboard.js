document.addEventListener('DOMContentLoaded', () => {
    const player = getCurrentPlayer();
    if (!player) {
        window.location.href = '../register/register.html';
        return;
    }

    document.getElementById('playerNameDisplay').textContent = player.name;
    document.getElementById('playerIdDisplay').textContent = player.id;
    document.getElementById('highScoreDisplay').textContent = player.bestScore || 0;

    const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - (player.attemptsUsed || 0));
    document.getElementById('attemptsDisplay').textContent = `${attemptsRemaining}/${MAX_ATTEMPTS}`;

    const startQuizBtn = document.getElementById('startQuizBtn');
    if (attemptsRemaining <= 0) {
        startQuizBtn.disabled = true;
        startQuizBtn.textContent = 'No Attempts Remaining';
        startQuizBtn.style.opacity = '0.5';
        startQuizBtn.style.cursor = 'not-allowed';
    } else {
        startQuizBtn.addEventListener('click', () => window.location.href = '../quiz/start.html');
    }

    document.getElementById('viewLeaderboardBtn').addEventListener('click', () => window.location.href = '../leaderboard/leaderboard.html');
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentPlayer');
        window.location.href = '../register/register.html';
    });
});