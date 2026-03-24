
// App.tsx



import { useState, useEffect } from 'react' // Importation des hooks useState et useEffect de React pour gérer l'état et les effets secondaires dans le composant App
import { fetchQuestions, shuffleAnswers } from './Api.tsx'// Importation des fonctions fetchQuestions et shuffleAnswers depuis le fichier Api.tsx pour récupérer les questions du quiz et mélanger les réponses
import './App.css' // Importation du fichier CSS pour styliser le composant App
import confetti from 'canvas-confetti' // Importation de la bibliothèque canvas-confetti pour afficher des confettis lorsque le quiz est terminé et que le score est bon

interface Question {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  shuffledAnswers: string[]
} // Définition de l'interface Question pour typer les objets question récupérés de l'API, incluant la question, la réponse correcte, les réponses incorrectes et les réponses mélangées

function Particles() {
  return (
    <div className="particles">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
          width: `${4 + Math.random() * 8}px`,
          height: `${4 + Math.random() * 8}px`,
          opacity: Math.random() * 0.5 + 0.2
        }} />
      ))}
    </div>
  )
} // Composant Particles pour afficher des particules animées en arrière-plan, utilisé à la fois sur l'écran d'accueil et pendant le quiz pour ajouter une touche visuelle dynamique

function App() { // Composant principal de l'application qui gère le quiz de culture générale
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<string>('easy')
  const [category, setCategory] = useState<string>('9')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [animating, setAnimating] = useState<boolean>(false)
  const [showWelcome, setShowWelcome] = useState<boolean>(true)
  const [timeLeft, setTimeLeft] = useState<number>(15) 

  const handleReplay = () => { // Fonction pour réinitialiser le quiz et recommencer une nouvelle partie, appelée lorsque l'utilisateur clique sur le bouton "Rejouer" à la fin du quiz ou sur le bouton "Quitter" pendant le quiz
    setScore(0)
    setCurrentQuestion(0)
    setIsFinished(false)
    setLoading(true)
    setGameStarted(false)
    setShowWelcome(true)
  }
  

  // useEffect pour récupérer les questions de l'API lorsque le jeu commence, en fonction de la difficulté et de la catégorie sélectionnées par l'utilisateur. Les questions sont ensuite mélangées avec la fonction shuffleAnswers avant d'être stockées dans l'état.
  useEffect(() => {
    if (!gameStarted) return
    setLoading(true)
    fetchQuestions(difficulty, category).then((data: Question[]) => {
      const withShuffled = data.map((q: Question) => ({
        ...q,
        shuffledAnswers: shuffleAnswers(q)
      }))
      setQuestions(withShuffled)
      setLoading(false)
    })
  }, [gameStarted])

  useEffect(() => {
    if (!isFinished) return
    if (score >= 1) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      })
    }
  }, [isFinished])


  useEffect(() => {
  if (!gameStarted || isFinished || loading) return
  setTimeLeft(15)
}, [currentQuestion])

useEffect(() => {
  if (!gameStarted || isFinished || loading) return
  if (timeLeft === 0) {
    handleAnswer('')
    return
  }
  const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
  return () => clearTimeout(timer)
}, [timeLeft, gameStarted, isFinished, loading])


// Fonction pour gérer la sélection d'une réponse par l'utilisateur. Elle met à jour l'état de la réponse sélectionnée, vérifie si la réponse est correcte et met à jour le score en conséquence. Ensuite, elle déclenche une animation avant de passer à la question suivante ou de terminer le quiz si c'était la dernière question.
  function handleAnswer(answer: string) {
    setSelectedAnswer(answer)
    setTimeout(() => {
      if (answer === questions[currentQuestion].correct_answer) {
        setScore(score + 1)
      }
      setAnimating(true)
      setTimeout(() => {
        if (currentQuestion + 1 >= questions.length) {
          setIsFinished(true)
        } else {
          setCurrentQuestion(currentQuestion + 1)
        }
        setSelectedAnswer(null)
        setAnimating(false)
      }, 500)
    }, 800)
  }

  // Affichage conditionnel pour gérer les différentes étapes du quiz : écran de bienvenue, sélection de la difficulté et de la catégorie, chargement des questions, affichage des questions et des réponses, et écran de fin avec le score final.

  if (showWelcome) {
    return (
      <div className="welcome-screen">
        <Particles />
        <div className="welcome-content">
          <div className="welcome-emoji">🎯</div>
          <h1 className="welcome-titre">Bienvenue sur<br/>Quiz Culture Générale</h1>
          <p className="welcome-desc">
            Testez vos connaissances sur des centaines de sujets.<br/>
            Histoire, Science, Musique, Sport et bien plus !
          </p>
          <div className="welcome-stats">
            <div className="stat">
              <span className="stat-number">10</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat">
              <span className="stat-number">7</span>
              <span className="stat-label">Catégories</span>
            </div>
            <div className="stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Niveaux</span>
            </div>
          </div>
          <button className="welcome-btn" onClick={() => setShowWelcome(false)}>
            Accéder au Quiz 🚀
          </button>
        </div>
      </div>
    )
  }
  
  // Si le jeu n'a pas encore commencé, on affiche l'écran de sélection de la difficulté et de la catégorie, ainsi qu'un bouton pour démarrer le quiz. Les options de difficulté et de catégorie sont liées à l'état pour permettre à l'utilisateur de les sélectionner avant de commencer.
  if (!gameStarted) {
    return (
      <>
        <Particles />
        <div className="quiz-container">
          <h1 className="accueil-titre">Quiz Culture Générale</h1>
          <p className="accueil-description">Sublimez votre quotidien par la connaissance !</p>
          <div className="select-group">
            <label>Difficulté</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
          <div className="select-group">
            <label>Catégorie</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="9">Culture générale</option>
              <option value="21">Sport</option>
              <option value="23">Histoire</option>
              <option value="17">Science</option>
              <option value="11">Films</option>
              <option value="12">Musique</option>
              <option value="15">Jeux vidéo</option>
            </select>
          </div>
          <button className="replay-btn" onClick={() => setGameStarted(true)}>
            Commencer →
          </button>
        </div>
      </>
    )
  }

  if (loading) return ( // Si les questions sont en cours de chargement, on affiche un message de chargement avec les particules en arrière-plan pour indiquer à l'utilisateur que le quiz est en train de se préparer.
    <>
      <Particles />
      <p>Chargement...</p>
    </>
  )

  if (isFinished) return ( // Si le quiz est terminé, on affiche l'écran de fin avec le score final, un message de félicitations et un bouton pour rejouer. Les confettis sont déclenchés dans un useEffect lorsque le quiz se termine et que le score est supérieur ou égal à 1 pour célébrer la réussite de l'utilisateur.
    <>
      <Particles />
      <div className='quiz-container'>
        <h1>Quiz terminé !</h1>
        <div className='score-number'>Score : {score} / {questions.length}</div>
        <p className='bien-joue'>Bien joué ! 🎉</p>
        <button className='replay-btn' onClick={handleReplay}>
          Rejouer 🔄
        </button>
      </div>
    </>
  )

  const question = questions[currentQuestion] // Récupération de la question actuelle à afficher, basée sur l'index currentQuestion dans le tableau de questions récupéré de l'API. Cette variable est utilisée pour afficher la question et les réponses correspondantes dans le rendu du composant.

  return ( // Rendu principal du composant App lorsque le quiz est en cours. Il affiche la question actuelle, les réponses mélangées, un compteur de temps, le numéro de la question en cours et un bouton pour quitter le quiz. Les réponses sont stylisées en fonction de la sélection de l'utilisateur et de la validité de la réponse.
    <>
      <Particles />
      <div className="quiz-container">
        <div className={animating ? 'slide-out' : 'slide-in'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="question-number">Question {currentQuestion + 1} / {questions.length}</p>
              <span className={`timer ${timeLeft <= 5 ? 'timer-urgent' : ''}`}>⏱ {timeLeft}s</span>

            <button className="quit-btn" onClick={handleReplay}>⬅ Quitter</button>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentQuestion / questions.length) * 100}%` }}></div>
          </div>
          <p className='question-text'>{question.question}</p>
          <div className='answers-grid'>
            {question.shuffledAnswers.map((answer: string, i: number) => (
              <button
                key={i}
                className={`answer-btn ${selectedAnswer === answer ? (answer === questions[currentQuestion].correct_answer ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleAnswer(answer)}
                disabled={!!selectedAnswer}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App // Exportation du composant App pour pouvoir l'utiliser dans d'autres parties de l'application.