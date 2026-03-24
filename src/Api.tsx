

// Api.tsx
async function fetchQuestions(difficulty: string = 'easy', category: string = '9') { // Par défaut, on récupère des questions de difficulté "easy" et de catégorie "General Knowledge" (id 9)
    const response = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&category=${category}`

    ); // 10 questions par défaut de l'api open trivia , ajustable selon les besoins
    
    
    const data = await response.json(); // Récupération des données au format JSON
    
    return data.results.map((question: any) => { // On map les questions pour les décoder et les formater correctement
        return {
            question: decodeHTML(question.question),
            correct_answer: decodeHTML(question.correct_answer), // On décode la réponse correcte pour éviter les problèmes d'affichage des caractères spéciaux
            incorrect_answers: question.incorrect_answers.map((ans: string) => decodeHTML(ans)) // On décode aussi les réponses incorrectes
        };
    });
}

function decodeHTML(html: string): string { // Fonction pour décoder les entités HTML 
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
} // Cette fonction utilise un élément textarea pour décoder les entités HTML, ce qui est une méthode courante pour gérer ce type de données.


function shuffleAnswers(question: { correct_answer: string; incorrect_answers: string[] }): string[] { // Fonction pour mélanger les réponses d'une question
    const answers = [...question.incorrect_answers, question.correct_answer];
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
} // Cette fonction permet de mélanger les réponses de manière aléatoire, ce qui garantit que la position de la réponse correcte change à chaque fois.

export { fetchQuestions, shuffleAnswers }; // On exporte les fonctions pour pouvoir les utiliser dans d'autres parties de l'application, notamment dans App.tsx pour récupérer les questions et mélanger les réponses.