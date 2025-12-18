import fullQuestionBank from "./questions.js";

let currentIndex = 0;
let score = 0;
let questions = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");

window.startGame = function () {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    // Xáo trộn toàn bộ 200 câu và lấy ra 20 câu để chơi lượt này
    // Đảm bảo không trùng lặp trong suốt 20 câu đó
    questions = [...fullQuestionBank]
        .sort(() => 0.5 - Math.random())
        .slice(0, 20); // Bạn có thể thay đổi số 20 thành số câu muốn chơi mỗi lượt

    loadQuestion();
};

function loadQuestion() {
    if (currentIndex >= questions.length) {
        endGame();
        return;
    }

    const q = questions[currentIndex];
    questionEl.innerText = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, q.answer);
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(user, correct) {
    const u = user.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.?]/g, '');
    const c = correct.toLowerCase().replace(/\s+/g, ' ').replace(/[.?]/g, '');
    const container = document.getElementById("main-container");

    if (u === c) {
        score += 10;
        document.getElementById("score").innerText = score;
        playSound("snd-correct");
        container.style.boxShadow = "0 0 20px rgba(138, 180, 248, 0.2)";
    } else {
        playSound("snd-wrong");
        container.style.border = "1px solid rgba(217, 101, 112, 0.5)"; // Màu đỏ nhẹ
    }

    setTimeout(() => {
        container.style.border = "none";
        container.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        currentIndex++;
        loadQuestion();
    }, 600);
}
