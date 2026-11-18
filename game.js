let gameSongs = [];
let currentSong = null;
let currentRound = 0;
let score = 0;
let roundStartTime = 0;
let timerInterval = null;
let gameActive = false;

const TOTAL_ROUNDS = 5;

// Skor berdasarkan waktu
function getPoints(seconds) {
    if (seconds <= 3) return 1000;
    if (seconds <= 6) return 800;
    if (seconds <= 10) return 600;
    if (seconds <= 15) return 400;
    if (seconds <= 20) return 200;
    return 100;
}

// Memulai game
async function startGame() {
    await refreshSongs();

    if (songs.length < TOTAL_ROUNDS) {
        alert("Tambahkan minimal 5 lagu untuk bermain!");
        return;
    }

    gameSongs = [...songs]
        .sort(() => Math.random() - 0.5)
        .slice(0, TOTAL_ROUNDS);

    currentRound = 0;
    score = 0;
    gameActive = true;

    document.getElementById("score").textContent = score;

    nextRound();
}

// Memulai ronde berikutnya
function nextRound() {
    stopTimer();
    stopAudio();

    if (currentRound >= TOTAL_ROUNDS) {
        finishGame();
        return;
    }

    currentSong = gameSongs[currentRound];
    currentRound++;

    document.getElementById("gameStatus").textContent =
        `ROUND ${currentRound} / ${TOTAL_ROUNDS}`;

    document.getElementById("answerInput").value = "";

    document.getElementById("answerInput").disabled = false;

    document.getElementById("disc").classList.add("playing");

    playAudio(currentSong.audio);

    roundStartTime = Date.now();

    startTimer();

    document.getElementById("answerInput").focus();
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        const seconds = Math.floor(
            (Date.now() - roundStartTime) / 1000
        );

        document.getElementById("timer").textContent =
            `00:${String(seconds).padStart(2, "0")}`;
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Cek jawaban
function submitAnswer() {
    if (!gameActive || !currentSong) return;

    const answer = normalize(
        document.getElementById("answerInput").value
    );

    if (!answer) return;

    const correct = normalize(currentSong.title);

    if (answer === correct) {
        const elapsed = (Date.now() - roundStartTime) / 1000;
        const points = getPoints(elapsed);

        score += points;

        document.getElementById("score").textContent = score;

        document.getElementById("gameStatus").textContent =
            `CORRECT! +${points}`;

        stopTimer();
        stopAudio();

        setTimeout(nextRound, 1200);
    } else {
        document.getElementById("gameStatus").textContent =
            "WRONG GUESS! TRY AGAIN";
    }
}

// Format jawaban
function normalize(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
}

// Skip
function skipSong() {
    if (!gameActive) return;

    stopAudio();
    stopTimer();

    document.getElementById("gameStatus").textContent =
        `SKIPPED: ${currentSong.title}`;

    setTimeout(nextRound, 800);
}

// Game selesai
function finishGame() {
    gameActive = false;
    stopTimer();
    stopAudio();

    document.getElementById("disc").classList.remove("playing");

    document.getElementById("gameStatus").textContent =
        "GAME OVER";

    const previousHighScore = Number(
        localStorage.getItem("SONIQ_HIGH_SCORE") || 0
    );

    if (score > previousHighScore) {
        localStorage.setItem("SONIQ_HIGH_SCORE", score);
    }

    alert(
        `GAME FINISHED!\nYour Score: ${score}\nHigh Score: ${Math.max(score, previousHighScore)}`
    );
}

// Enter untuk menjawab
document.addEventListener("keydown", event => {
    if (
        event.key === "Enter" &&
        document.activeElement.id === "answerInput"
    ) {
        submitAnswer();
    }
});
