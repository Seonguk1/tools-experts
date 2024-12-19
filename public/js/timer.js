let timeElapsed = 0;  // 경과된 시간 (초)
let timer_interval;     // 타이머 인터벌 변수
let isRunning = false; // 타이머 실행 상태

function startTimer() {
    if (!isRunning) {
        timer_interval = setInterval(() => {
            timeElapsed++;
            updateTimerDisplay();
        }, 1000);
        isRunning = true;
    }
}

function pauseTimer() {
    clearInterval(timer_interval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer_interval);
    timeElapsed = 0;
    isRunning = false;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timeElapsed / 3600);
    const minutes = Math.floor((timeElapsed % 3600) / 60);
    const seconds = timeElapsed % 60;

    document.getElementById('timer').textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
