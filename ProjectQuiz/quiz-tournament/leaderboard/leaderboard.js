// ─── Page Load ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const tbody = document.getElementById('leaderboardBody');

    // If no one has played yet, show a placeholder row
    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No scores yet! Be the first to play.</td></tr>';
        return;
    }

    renderLeaderboardRows(leaderboard, tbody);
});

// ─── Leaderboard Table ────────────────────────────────────────────────────────

// Builds and appends one table row per player
function renderLeaderboardRows(leaderboard, tbody) {
    const medals = ['🥇 1', '🥈 2', '🥉 3'];

    leaderboard.forEach((player, index) => {
        // Top 3 get a special CSS class for gold/silver/bronze styling
        const rankClass = index === 0 ? 'rank-1'
                        : index === 1 ? 'rank-2'
                        : index === 2 ? 'rank-3'
                        : '';

        const rankDisplay = medals[index] || `#${index + 1}`;
        const accuracyDisplay = player.accuracy !== undefined ? `${player.accuracy}%` : 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="${rankClass}">${rankDisplay}</td>
            <td class="${rankClass}">${player.name} (${player.id})</td>
            <td class="${rankClass}">${player.score}</td>
            <td class="${rankClass}">${accuracyDisplay}</td>
        `;
        tbody.appendChild(row);
    });
}