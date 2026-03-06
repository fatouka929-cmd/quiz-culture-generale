// Les variables d'état du jeu
let questions = [];
// Le tableau des 10 questions récupérées depuis l'API
let currentQuestion = 0;
// Le numéro de la question en cours (commence à 0)
let score = 0;
// Le score actuel du joueur
let isFinished = false;
// Est-ce que le quiz est terminé ?

// Fonction pour vérifier la réponse du joueur
function checkAnswer(selectedAnswer, correct_answer) {
    if (selectedAnswer === correct_answer) {
        // Si la réponse est correcte, on incrémente le score(on ajoute 1 point si c'est correct)
        score++;
        return true;
    }
    return false;
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    currentQuestion++;
    // On vérifie si on a atteint la dernière question
    if (currentQuestion >= questions.length) {
        isFinished = true;
        // Le quiz est terminé 
    }
}

// Fonction pour réinitialiser le jeu (bouton Rejouer)
function resetGame() {
    currentQuestion = 0;
    // On remet la question à 0
    score = 0;
    // On remet le score à 0
    isFinished = false;
    // On remet le quiz en cours
    questions = [];
    // On vide le tableau des questions
}

//Maintenant on a stocker les questions, gérer le numéro de la questoion en cous
//Calculer le score , détecter la fin du quiz et prévu un bouton pour rejouer