import fullQuestionBank from "./questions.js";

let currentIndex = 0;
let questions = [];
let score = 0;
let wrongAnswers = []; // Lưu các câu làm sai để ôn tập

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Khởi động bài học
setTimeout(() => {
    startQuiz();
}, 1000);

function startQuiz() {
    // Lấy ngẫu nhiên 20 câu từ ngân hàng 200 câu
    questions = [...fullQuestionBank].sort(() => 0.5 - Math.random()).slice(0, 20);
    appendBotMsg("Chào em! 👋 Thầy là gia sư AI của em đây. Hôm nay chúng ta sẽ cùng chinh phục 20 câu hỏi tiếng Anh nhé. Sẵn sàng chưa nào?");
    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= questions.length) {
        appendBotMsg(`🎉 **Chúc mừng em đã hoàn thành!** \n\nKết quả: **${score}/200** điểm. \n\nHẹn gặp lại em ở những bài học bổ ích tiếp theo nhé!`);
        return;
    }

    const q = questions[currentIndex];
    
    // Tạo khung câu hỏi
    const quizCard = document.createElement("div");
    quizCard.className = "quiz-card";
    
    let typeLabel = q.type === 4 ? "✍️ Viết lại câu" : q.type === 3 ? "🔍 Tìm lỗi sai" : "📝 Trắc nghiệm";
    quizCard.innerHTML = `<small style="color: var(--accent); opacity: 0.8;">${typeLabel}</small>
                         <p style="margin: 10px 0; font-size: 1.1rem; line-height: 1.4;">${q.question.replace(/\*/g, "")}</p>`;

    if (q.type === 1 || q.type === 3) {
        userInput.disabled = true;
        userInput.placeholder = "Hãy chọn đáp án đúng bên dưới...";
        const optionsContainer = document.createElement("div");
        q.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(opt, q);
            optionsContainer.appendChild(btn);
        });
        quizCard.appendChild(optionsContainer);
    } else {
        userInput.disabled = false;
        userInput.placeholder = "Nhập câu trả lời của em tại đây...";
        userInput.focus();
        sendBtn.onclick = () => {
            const val = userInput.value.trim();
            if(val) {
                appendUserMsg(val);
                checkAnswer(val, q);
                userInput.value = "";
            }
        };
    }

    chatBox.appendChild(quizCard);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function checkAnswer(userChoice, questionObj) {
    const userClean = userChoice.toLowerCase().trim().replace(/[.?]/g, "");
    const correctClean = questionObj.answer.toLowerCase().trim().replace(/[.?]/g, "");

    if (userClean === correctClean) {
        score += 10;
        document.getElementById("snd-correct").play();
        appendBotMsg("🌟 **Chính xác!** Em nắm bài rất chắc đấy.");
    } else {
        wrongAnswers.push(questionObj);
        document.getElementById("snd-wrong").play();
        appendBotMsg(`💡 **Chưa đúng rồi.** Đáp án là: \`${questionObj.answer}\``);
    }

    // AI giải thích ngữ pháp
    explainKnowledge(questionObj);

    currentIndex++;
    setTimeout(loadQuestion, 2500); // Tạm dừng 2.5s để học sinh kịp đọc giải thích
}

function explainKnowledge(q) {
    let tip = "";
    if (q.id <= 50) tip = "📌 **Nhắc em:** Câu này dùng kiến thức về **Thì**. Hãy chú ý các từ khóa (Keywords) như 'since', 'at the moment' hay 'last night' để chọn đúng dạng động từ nhé.";
    else if (q.id <= 100) tip = "📌 **Mẹo nhỏ:** Đây là câu **Bị động**. Cấu trúc luôn phải có `Be + V3/ed`. Em hãy xem chủ ngữ là vật hay người để chia nhé.";
    else if (q.id <= 150) tip = "📌 **Lưu ý:** Với câu **Điều kiện loại 2**, dù chủ ngữ là gì thì động từ 'To be' luôn ưu tiên dùng `were` em nhé.";
    else tip = "📌 **Ghi chú:** Đây là **Mệnh đề quan hệ**. 'Who' thay cho người, 'Which' thay cho vật. Đừng để bị lừa bởi các danh từ đứng trước nhé!";

    const tipDiv = document.createElement("div");
    tipDiv.style = "margin: 5px 0 20px 40px; color: var(--text-secondary); font-size: 0.9rem; font-style: italic;";
    tipDiv.innerHTML = tip;
    chatBox.appendChild(tipDiv);
}

function appendBotMsg(text) {
    const msg = document.createElement("div");
    msg.style = "display: flex; gap: 12px; margin: 15px 0; max-width: 85%; animation: slideUp 0.3s ease;";
    msg.innerHTML = `
        <div style="min-width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #4285f4, #9b72cb); display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-wand-magic-sparkles" style="color: white; font-size: 14px;"></i>
        </div>
        <div style="background: transparent; padding: 5px 0;">${text}</div>
    `;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendUserMsg(text) {
    const msg = document.createElement("div");
    msg.style = "display: flex; justify-content: flex-end; margin: 15px 0; animation: slideUp 0.3s ease;";
    msg.innerHTML = `<div style="background: #333537; padding: 12px 20px; border-radius: 20px; max-width: 70%;">${text}</div>`;
    chatBox.appendChild(msg);
}
