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
    if (user === correct) {
        score += 10;
        scoreEl.innerText = score;
    }
    
    // Tự động chuyển câu sau 300ms để người dùng kịp thấy phản hồi
    currentIndex++;
    loadQuestion();
}

function endGame() {
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("end-screen").style.display = "block";
    document.getElementById("final-score").innerText = 
        `Điểm cuối cùng: ${score}`;
}
