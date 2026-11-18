function correctEffect() {
    const panel = document.querySelector(".game-panel");

    if (!panel) return;

    panel.classList.remove("correct-flash");

    void panel.offsetWidth;

    panel.classList.add("correct-flash");

    setTimeout(() => {
        panel.classList.remove("correct-flash");
    }, 500);
}

function wrongEffect() {
    const panel = document.querySelector(".game-panel");

    if (!panel) return;

    panel.classList.remove("shake");

    void panel.offsetWidth;

    panel.classList.add("shake");

    setTimeout(() => {
        panel.classList.remove("shake");
    }, 400);
}

function gameOverEffect() {
    document.body.classList.add("game-over");

    setTimeout(() => {
        document.body.classList.remove("game-over");
    }, 1000);
}
