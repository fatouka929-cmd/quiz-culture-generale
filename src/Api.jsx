// Fonction pour récupérer les questions depuis l'API
async function fetchQuestions() {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    //fetch() va chercher les données sur l'API
    const data = await response.json();
    // data.results contient le tableau des 10 questions
    
    return data.results.map(question => {
        // Pour chaque question, on décode les entités HTML
        return {
            question: decodeHTML(question.question),
            correct_answer: decodeHTML(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(ans => decodeHTML(ans))
        };
    });
}

// Fonction pour décoder les entités HTML
function decodeHTML(text) {
    const element = document.createElement("textarea");
    // On crée une zone de texte invisible
    element.innerHTML = text;
    // Le navigateur convertit automatiquement les entités
    return element.value;
    // On retourne le texte propre
}

// Fonction pour mélanger les réponses
function shuffleAnswers(question) {
    // On regroupe la bonne réponse + les 3 mauvaises dans un seul tableau
    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    
    // On mélange le tableau aléatoirement
    for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }
    
    return allAnswers;
}
//Du coup l'ordre change à chaque fois aléatoirement
