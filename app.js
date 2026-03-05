// Fonction principale qui démarre le quiz
async function startQuiz() {
    // On récupère les questions depuis l'API
    questions = await fetchQuestions();
    
    // On mélange les réponses de chaque question
    questions = questions.map(question => {
        return {
            ...question,
            shuffledAnswers: shuffleAnswers(question)
        };
    });
    
    // On affiche la première question
    currentQuestion = 0;
    score = 0;
    isFinished = false;
}

// Fonction pour afficher la question en cours
function displayQuestion() {
    const question = questions[currentQuestion];
    
    // On affiche le numéro de la question
    console.log("Question " + (currentQuestion + 1) + "/10");
    
    // On affiche le texte de la question
    console.log(question.question);
    
    // On affiche les 4 réponses mélangées
    question.shuffledAnswers.forEach((answer, index) => {
        console.log(index + 1 + ". " + answer);
    });
}


// On démarre le quiz
startQuiz().then(() => displayQuestion());