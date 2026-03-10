const MAX_ATTEMPTS = 3;

function initSystem() {
    if (!localStorage.getItem('leaderboard')) {
        localStorage.setItem('leaderboard', JSON.stringify([]));
    }
    if (!localStorage.getItem('forumComments')) {
        localStorage.setItem('forumComments', JSON.stringify([]));
    }
}

function getCurrentPlayer() {
    const data = localStorage.getItem('currentPlayer');
    if (!data) return null;
    return JSON.parse(data);
}

function saveCurrentPlayer(player) {
    localStorage.setItem('currentPlayer', JSON.stringify(player));
}

function updateLeaderboard(player, latestAccuracy = 0) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Look for this player's existing entry by matching their ID
    let existing = null;
    for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].id === player.id) {
            existing = leaderboard[i];
            break;
        }
    }

    if (existing) {
        if (player.bestScore > existing.score) {
            existing.score = player.bestScore;
            existing.accuracy = latestAccuracy;
        }
    } else {
        leaderboard.push({
            name: player.name,
            id: player.id,
            score: player.bestScore,
            accuracy: latestAccuracy
        });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

initSystem();