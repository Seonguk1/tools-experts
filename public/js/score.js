let score = 0;
const maxScore = 100;
const duration = 5000;

function updateScore() {
    const startTime = Date.now();
    const endTime = startTime + duration;

    function step() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 지수 함수로 점수 증가
        score = Math.round(maxScore * (1 - Math.exp(-5 * progress))); // 지수적 증가

        document.getElementById("score").textContent = score;

        if (now < endTime) {
            requestAnimationFrame(step);
        } else {
            document.getElementById("score").textContent = maxScore;
        }
    }

    step();
}

updateScore();
