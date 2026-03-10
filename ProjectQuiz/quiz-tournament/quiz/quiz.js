// ─── Tournament Structure ─────────────────────────────────────────────────────

const rounds = [
    { name: 'Round 1',      qCount: 10, minScore: 5000 },
    { name: 'Quarterfinal', qCount: 8,  minScore: 4000 },
    { name: 'Semifinal',    qCount: 6,  minScore: 3000 },
    { name: 'Final',        qCount: 5,  minScore: 3000 }
];

// ─── Game State Variables ─────────────────────────────────────────────────────

let allQuestions = [];           // all questions loaded from JSON
let shuffledQuestions = [];      // randomised order for this attempt

let currentRoundIndex = 0;      // which round we're on (0 = Round 1)
let currentQuestionIndex = 0;   // index into shuffledQuestions
let questionsInCurrentRound = 0; // how many questions answered in this round

let score = 0;                  // total tournament score (carries across rounds)
let roundScore = 0;             // score just for the current round

let correctCount = 0;           // total correct answers across all rounds
let totalQuestionsAnswered = 0; // total questions attempted (for accuracy calc)
let activeQuestionData = null;  // the question currently on screen
let timerInterval = null;       // reference to the countdown interval
let timeLeft = 10;              // seconds remaining for current question
let bracketTimerInterval = null; // countdown on the bracket/round intro screen

let immunityActive = false;     // Immunity powerup: wrong answer doesn't lose points
let redemptionActive = false;   // Redemption powerup: doubles points on correct, penalises on wrong
let explanationTimeoutId = null; // timeout that auto-advances after showing explanation

let player = null;              // current player object from localStorage
let warningCount = 0;           // counts how many times the player changed tabs

// ─── Questions Page Load ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    player = getCurrentPlayer();

    // If no player is registered, or they've used all their attempts, send them to register
    if (!player || player.attemptsUsed >= MAX_ATTEMPTS) {
        window.location.href = '../register/register.html';
        return;
    }

    // Show how many attempts they have left on the start screen
    document.getElementById('startAttempts').textContent = MAX_ATTEMPTS - player.attemptsUsed;

    // Load the question bank from the JSON file
    try {
        const response = await fetch('../data/questions.json');
        allQuestions = await response.json();
    } catch (error) {
        console.error('Failed to load questions', error);
    }

    document.getElementById('realStartBtn').addEventListener('click', startTournament);
});

// ─── Tournament Start ─────────────────────────────────────────────────────────

async function startTournament() {
    // Try to go fullscreen (silently ignore if the browser blocks it)
    try { await document.documentElement.requestFullscreen(); } catch (e) {}

    // Use up one attempt and save it immediately
    player.attemptsUsed++;
    saveCurrentPlayer(player);

    // Switch from the start screen to the quiz container
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');

    // Listen for tab switching (anti-cheat)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Shuffle the questions for this attempt
    shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());

    // Reset all game state
    score = 0;
    roundScore = 0;
    correctCount = 0;
    totalQuestionsAnswered = 0;
    currentRoundIndex = 0;
    currentQuestionIndex = 0;

    showBracket();
}

// ─── Anti-Cheat ───────────────────────────────────────────────────────────────

function handleVisibilityChange() {
    if (document.hidden) {
        warningCount++;
        if (warningCount >= 2) {
            alert('Disqualified due to changing tabs. Redirecting to leaderboard.');
            endTournament(false);
        } else {
            alert('Warning: Do not change tabs! 1 warning remaining.');
        }
    }
}

// ─── Bracket / Round Intro Screen ────────────────────────────────────────────

function showBracket() {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('bracketScreen').classList.remove('hidden');

    // Mark each bracket step as completed, active, or upcoming
    for (let i = 0; i <= 4; i++) {
        const step = document.getElementById(`bracket-${i}`);
        if (!step) continue;
        step.classList.remove('active', 'completed');
        if (i < currentRoundIndex) step.classList.add('completed');
        else if (i === currentRoundIndex) step.classList.add('active');
    }

    // Auto-start countdown on the "Start Round" button
    const startBtn = document.getElementById('startCurrentRoundBtn');
    startBtn.disabled = false;
    let secondsLeft = 5;
    startBtn.textContent = `Quiz starts in ${secondsLeft} secs...`;

    if (bracketTimerInterval) clearInterval(bracketTimerInterval);
    bracketTimerInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            startBtn.textContent = `Quiz starts in ${secondsLeft} secs...`;
        } else {
            clearInterval(bracketTimerInterval);
            startBtn.click();
        }
    }, 1000);
}

document.getElementById('startCurrentRoundBtn').addEventListener('click', (e) => {
    if (e.target.disabled) return;
    e.target.disabled = true;
    if (bracketTimerInterval) clearInterval(bracketTimerInterval);
    document.getElementById('bracketScreen').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    startRound();
});

// ─── Round Start ──────────────────────────────────────────────────────────────

function startRound() {
    roundScore = 0;
    questionsInCurrentRound = 0;
    document.getElementById('roundName').textContent = rounds[currentRoundIndex].name;
    document.getElementById('scoreDisplay').textContent = roundScore;
    document.getElementById('minScoreDisplay').textContent = rounds[currentRoundIndex].minScore;
    triggerRoundBanner(rounds[currentRoundIndex].name);
    setTimeout(loadNextQuestion, 1500);
}

// Shows a brief coloured banner with the round name
function triggerRoundBanner(roundName) {
    const banner = document.getElementById('roundBanner');
    banner.textContent = `=== ${roundName.toUpperCase()} ===`;
    banner.classList.remove('hidden');
    const bannerColors = ['#bfdff3', '#ccd537', '#7a88fe', '#fabe37'];
    banner.style.backgroundColor = bannerColors[currentRoundIndex] || '#7a88fe';
    setTimeout(() => banner.classList.add('hidden'), 1500);
}

// ─── Question Loading ─────────────────────────────────────────────────────────

function loadNextQuestion() {
    document.getElementById('explanationPopup').classList.add('hidden');
    resetPowerupState();

    const roundDetails = rounds[currentRoundIndex];

    // If we've answered all questions for this round, finish it
    if (questionsInCurrentRound >= roundDetails.qCount) {
        finishRound();
        return;
    }

    activeQuestionData = shuffledQuestions[currentQuestionIndex];

    // Update question counter and progress bar
    document.getElementById('currentQNum').textContent = questionsInCurrentRound + 1;
    document.getElementById('totalQNum').textContent = roundDetails.qCount;
    document.getElementById('questionText').textContent = activeQuestionData.question;
    document.getElementById('progressBar').style.width = `${(questionsInCurrentRound / roundDetails.qCount) * 100}%`;

    // Reset and fill the pre-built option buttons
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById('optBtn' + i);
        btn.textContent = activeQuestionData.options[i];
        btn.className = 'option-btn';       // reset all classes (removes hidden, correct, wrong, faded)
        btn.disabled = false;
        btn.onclick = () => selectAnswer(btn, activeQuestionData.options[i]);
    }

    startTimer();
}

// ─── Answer Selection ─────────────────────────────────────────────────────────

function selectAnswer(selectedBtn, selectedOption) {
    clearInterval(timerInterval);

    // Disable all buttons so the player can't click twice
    const allOptionBtns = Array.from(document.querySelectorAll('.option-btn'));
    allOptionBtns.forEach(btn => btn.disabled = true);

    totalQuestionsAnswered++;
    const isCorrect = selectedOption === activeQuestionData.answer;

    if (isCorrect) {
        correctCount++;
        selectedBtn.classList.add('correct');

        // Fade out all other buttons
        allOptionBtns.forEach(btn => {
            if (btn !== selectedBtn) btn.classList.add('faded');
        });

        // Save this question to the forum for discussion
        saveToForum(activeQuestionData);

        // Points: start at 1000, lose 100 per second used, minimum 500
        let pointsEarned = Math.max(500, 1000 - ((10 - timeLeft) * 100));

        // Redemption doubles points on a correct answer
        if (redemptionActive) pointsEarned *= 2;

        score += pointsEarned;
        roundScore += pointsEarned;
        showExplanation('Correct! 🎉');

    } else {
        selectedBtn.classList.add('wrong');

        // Highlight the correct answer and fade everything else
        allOptionBtns.forEach(btn => {
            if (btn.textContent === activeQuestionData.answer) btn.classList.add('correct');
            else if (btn !== selectedBtn) btn.classList.add('faded');
        });

        // Immunity: no penalty on wrong answer
        if (immunityActive) {
            score += 500;
            roundScore += 500;
        // Redemption: penalises wrong answers (lose 500, minimum 0)
        } else if (redemptionActive) {
            score = Math.max(0, score - 500);
            roundScore = Math.max(0, roundScore - 500);
        }

        showExplanation('Incorrect! ❌');
    }

    document.getElementById('scoreDisplay').textContent = roundScore;
}