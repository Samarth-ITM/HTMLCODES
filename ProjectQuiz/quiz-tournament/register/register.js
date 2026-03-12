document.addEventListener('DOMContentLoaded', () => {
    if (getCurrentPlayer()) {
        window.location.href = '../dashboard/dashboard.html';
        return;
    }

    const newId = 'P' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('playerId').textContent = newId;

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('playerName').value.trim();
        if (name.length < 2) {
            alert('Please enter a valid name (at least 2 characters).');
            return;
        }
        saveCurrentPlayer({ name, id: newId, attemptsUsed: 0, bestScore: 0 });
        window.location.href = '../quiz/start.html';
    });
});