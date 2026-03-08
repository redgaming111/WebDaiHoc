const semesterList = document.getElementById("semesterList");
const subjectSection = document.getElementById("subjectSection");
const semesterSection = document.getElementById("semesterSection");
const subjectList = document.getElementById("subjectList");
const semesterTitle = document.getElementById("semesterTitle");
const backBtn = document.getElementById("backBtn");

/* ========================
   Render danh sách kỳ học
======================== */
Object.keys(semesters).forEach(semester => {
    const btn = document.createElement("button");
    btn.innerText = semester;
    btn.onclick = () => showSubjects(semester);
    semesterList.appendChild(btn);
});

/* ========================
   Hiển thị môn học
======================== */
function showSubjects(semester) {

    semesterSection.style.display = "none";
    subjectSection.style.display = "block";

    semesterTitle.innerText = semester;
    subjectList.innerHTML = "";

    Object.keys(semesters[semester]).forEach(subject => {

        const btn = document.createElement("button");
        btn.innerText = subject;

        btn.onclick = () => showSections(semester, subject);

        subjectList.appendChild(btn);

    });
}

/* ========================
   Hiển thị section
======================== */
function showSections(semester, subject) {

    semesterTitle.innerText = semester + " - " + subject;
    subjectList.innerHTML = "";

    const sections = semesters[semester][subject].sections;

    if (!sections || Object.keys(sections).length === 0) {
        subjectList.innerHTML = "<p>Chưa có nội dung.</p>";
        return;
    }

    Object.keys(sections).forEach(sectionName => {

        const btn = document.createElement("button");
        btn.innerText = sectionName;
        btn.onclick = () =>
            showQuestions(semester, subject, sectionName);

        subjectList.appendChild(btn);

        const quizBtn = document.createElement("button");
        quizBtn.innerText = "Luyện đề";
        quizBtn.onclick = () =>
            startQuiz(semester, subject, sectionName);

        subjectList.appendChild(quizBtn);

    });
}

/* ========================
   Hiển thị câu hỏi thường
======================== */
function showQuestions(semester, subject, sectionName) {

    semesterTitle.innerText =
        semester + " - " + subject + " - " + sectionName;

    subjectList.innerHTML = "";

    const questions =
        semesters[semester][subject].sections[sectionName];

    if (!questions || questions.length === 0) {
        subjectList.innerHTML = "<p>Chưa có nội dung.</p>";
        return;
    }

    questions.forEach((item, index) => {

        const box = document.createElement("div");
        box.className = "question-box";

        const question = document.createElement("p");

        question.innerHTML =
            `<strong>Câu ${index + 1}:</strong> ${item.question}`;

        question.style.cursor = "pointer";

        const answer = document.createElement("p");

        answer.innerHTML =
            `<em>Trả lời:</em> ${item.answer}`;

        answer.style.display = "none";

        question.onclick = () => {

            answer.style.display =
                answer.style.display === "none"
                ? "block"
                : "none";

        };

        box.appendChild(question);
        box.appendChild(answer);

        subjectList.appendChild(box);

    });
}

/* ========================
   QUIZ SYSTEM
======================== */
function startQuiz(semester, subject, sectionName) {

    semesterTitle.innerText = "Quiz";
    subjectList.innerHTML = "";

    let questions =
        [...semesters[semester][subject].sections[sectionName]];

    /* trộn câu hỏi */
    questions.sort(() => Math.random() - 0.5);

    const allAnswers = questions.map(q => q.answer);

    questions.forEach((q, index) => {

        const box = document.createElement("div");
        box.className = "question-box";

        const title = document.createElement("p");

        title.innerHTML =
            `<strong>Câu ${index + 1}:</strong> ${q.question}`;

        box.appendChild(title);

        /* tạo đáp án */
        let options = [q.answer];

        while (options.length < 4) {

            const rand =
                allAnswers[
                    Math.floor(Math.random() * allAnswers.length)
                ];

            if (!options.includes(rand)) {
                options.push(rand);
            }

        }

        /* trộn đáp án */
        options.sort(() => Math.random() - 0.5);

        options.forEach(opt => {

const label = document.createElement("label");
label.className = "answer-box";

const radio = document.createElement("input");

radio.type = "radio";
radio.name = "q" + index;
radio.value = opt;

const text = document.createElement("span");
text.innerText = opt;

label.appendChild(radio);
label.appendChild(text);

box.appendChild(label);

        });

        subjectList.appendChild(box);

    });

    /* ========================
       SUBMIT
    ======================== */

    const submit = document.createElement("button");
    submit.innerText = "Nộp bài";

    submit.onclick = () => {

        let score = 0;

        questions.forEach((q, index) => {

            const radios =
                document.querySelectorAll(`input[name="q${index}"]`);

            let selected = null;

            radios.forEach(r => {
                if (r.checked) selected = r;
            });

            radios.forEach(r => {

                const label = r.parentElement;

                if (r.value === q.answer) {

                    label.style.background = "#dcfce7";
                    label.style.border = "1px solid #16a34a";

                }

                if (
                    selected &&
                    r === selected &&
                    r.value !== q.answer
                ) {

                    label.style.background = "#fee2e2";
                    label.style.border = "1px solid #dc2626";

                }

                r.disabled = true;

            });

            if (selected && selected.value === q.answer) {
                score++;
            }

        });

/* ===== BẢNG ĐIỂM ===== */

const resultBox = document.createElement("div");
resultBox.className = "result-box";

const percent = Math.round((score / questions.length) * 100);

resultBox.innerHTML = `
<h2>Kết quả bài làm</h2>
<div class="score">${score} / ${questions.length}</div>
<div class="percent">${percent}%</div>
`;

const retryBtn = document.createElement("button");
retryBtn.innerText = "Làm lại bài";
retryBtn.className = "retry-btn";

retryBtn.onclick = () => {
    startQuiz(semester, subject, sectionName);
};

resultBox.appendChild(retryBtn);

subjectList.appendChild(resultBox);
    };

    subjectList.appendChild(submit);

}

/* ========================
   Nút quay lại
======================== */
backBtn.onclick = () => {

    subjectSection.style.display = "none";
    semesterSection.style.display = "block";

};