async function fetchQuestions(difficulty: string = 'easy', category: string = '9') {
    const response = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&category=${category}`
    );
    const data = await response.json();
    
    return data.results.map((question: any) => {
        return {
            question: decodeHTML(question.question),
            correct_answer: decodeHTML(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map((ans: string) => decodeHTML(ans))
        };
    });
}

function decodeHTML(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function shuffleAnswers(question: { correct_answer: string; incorrect_answers: string[] }): string[] {
    const answers = [...question.incorrect_answers, question.correct_answer];
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
}

export { fetchQuestions, shuffleAnswers };