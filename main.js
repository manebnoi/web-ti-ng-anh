import fullQuestionBank from "./questions.js";
let currentPlayer = { name: "", class: "", score: 0 };
        let currentQuestions = [];
        let currentIndex = 0;
        let timeLeft = 25 * 60;
        let timer;

        function showScreen(id) {
            document.querySelectorAll('.container > div').forEach(d => d.style.display = 'none');
            document.getElementById(id).style.display = 'block';
        }

        function toggleMusic() {
            const m = document.getElementById('bg-music');
            const btn = document.querySelector('.music-control');
            if (m.paused) { m.play(); btn.innerText = "🔊"; }
            else { m.pause(); btn.innerText = "🔇"; }
        }

        function startGame() {
            const name = document.getElementById('player-name').value;
            const cls = document.getElementById('player-class').value;
            if(!name || !cls) return alert("Nhập đủ thông tin!");
            
            currentPlayer = { name, class: cls, score: 0 };
            document.getElementById('display-info').innerText = name + " - " + cls;
            
            // Lấy 20 câu ngẫu nhiên
            currentQuestions = [...fullQuestionBank].sort(() => 0.5 - Math.random()).slice(0, 20);
            currentIndex = 0;
            timeLeft = 25 * 60;
            
            showScreen('game-screen');
            loadQuestion();
            timer = setInterval(updateTimer, 1000);
        }

        function updateTimer() {
            timeLeft--;
            let m = Math.floor(timeLeft / 60);
            let s = timeLeft % 60;
            document.getElementById('timer').innerText = `${m}:${s < 10 ? '0'+s : s}`;
            if(timeLeft <= 0) { clearInterval(timer); alert("Hết giờ!"); location.reload(); }
        }

        function loadQuestion() {
            if(currentIndex >= currentQuestions.length) return endGame();
            
            const q = currentQuestions[currentIndex];
            const area = document.getElementById('answer-area');
            const txt = document.getElementById('question-text');
            const title = document.getElementById('question-type-title');
            
            area.innerHTML = "";
            txt.innerText = q.question.replace(/\*/g, "");
            document.getElementById('feedback').innerText = "";

            if(q.type === 1 || q.type === 3) {
                title.innerText = q.type === 1 ? "Chọn đáp án đúng" : "Tìm lỗi sai";
                let grid = document.createElement('div');
                grid.className = "options-grid";
                q.options.forEach(opt => {
                    let b = document.createElement('button');
                    b.innerText = opt;
                    b.onclick = () => check(opt, q.answer);
                    grid.appendChild(b);
                });
                area.appendChild(grid);
            } else {
                title.innerText = q.type === 2 ? "Ghép thành câu đúng" : "Viết lại câu đúng";
                let inp = document.createElement('input');
                inp.id = "user-inp";
                let b = document.createElement('button');
                b.innerText = "GỬI";
                b.onclick = () => check(document.getElementById('user-inp').value, q.answer);
                area.appendChild(inp); area.appendChild(b);
            }
        }

        function check(user, correct) {
            const f = document.getElementById('feedback');
            if(user.trim().toLowerCase().replace(/[.?!]/g,"") === correct.toLowerCase().replace(/[.?!]/g,"")) {
                currentPlayer.score += 10;
                document.getElementById('score').innerText = currentPlayer.score;
                f.innerText = "Chính xác! +10"; f.style.color = "lime";
                setTimeout(() => { currentIndex++; loadQuestion(); }, 1000);
            } else {
                f.innerText = "Sai rồi! Đổi câu hỏi khác..."; f.style.color = "red";
                // Đổi câu hỏi khác
                let newQ = fullQuestionBank[Math.floor(Math.random()*fullQuestionBank.length)];
                currentQuestions[currentIndex] = newQ;
                setTimeout(loadQuestion, 1500);
            }
        }

        function endGame() {
            clearInterval(timer);
            showScreen('result-screen');
            document.getElementById('final-score').innerText = "Điểm: " + currentPlayer.score;
            document.getElementById('gems').innerText = Math.floor(currentPlayer.score/10);
            saveLeaderboard();
        }

        function saveLeaderboard() {
            let lb = JSON.parse(localStorage.getItem('eng_lb') || "[]");
            lb.push(currentPlayer);
            lb.sort((a,b) => b.score - a.score);
            localStorage.setItem('eng_lb', JSON.stringify(lb.slice(0,10)));
        }

        function showLeaderboard() {
            showScreen('leaderboard-screen');
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = "";
            let lb = JSON.parse(localStorage.getItem('eng_lb') || "[]");
            lb.forEach((p, i) => {
                tbody.innerHTML += `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.class}</td><td>${p.score}</td></tr>`;
            });
        }

        // Vẽ hiệu ứng Canvas background cho mượt
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let pts = [];
        function initCanvas() {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            pts = [];
            for(let i=0; i<50; i++) pts.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*2, d: Math.random()*2*Math.PI});
        }
        function animate() {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.fillStyle = "#00f2ff";
            pts.forEach(p => {
                p.x += Math.cos(p.d) * 0.5; p.y += Math.sin(p.d) * 0.5;
                if(p.x < 0) p.x = canvas.width; if(p.y < 0) p.y = canvas.height;
                if(p.x > canvas.width) p.x = 0; if(p.y > canvas.height) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        window.onresize = initCanvas;
        initCanvas(); animate();
    </script>
</body>
</html>
