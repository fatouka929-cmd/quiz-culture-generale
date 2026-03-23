import { useState, useEffect, useRef } from 'react'
import { fetchQuestions, shuffleAnswers } from './Api.tsx'
import './App.css'
import confetti from 'canvas-confetti'

interface Question {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  shuffledAnswers: string[]
}

// Composant particules en arrière-plan
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
}

function App() {
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

  const handleReplay = () => {
    setScore(0)
    setCurrentQuestion(0)
    setIsFinished(false)
    setLoading(true)
    setGameStarted(false)
    setShowWelcome(true)
  }

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
      }, 600)
    }, 800)
  }

  // ── PAGE DE BIENVENUE ──
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

  // ── PAGE DE CONFIGURATION ──
  if (!gameStarted) {
    return (
      <div className="quiz-container">
        <h1 className="accueil-titre">🎯 Quiz Culture Générale</h1>
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
    )
  }

  if (loading) return <p>Chargement...</p>

  if (isFinished) return (
    <div className='quiz-container'>
      <h1>Quiz terminé !</h1>
      <div className='score-number'>Score : {score} / {questions.length}</div>
      <p className='bien-joue'>Bien joué ! 🎉</p>
      <button className='replay-btn' onClick={handleReplay}>
        Rejouer 🔄
      </button>
    </div>
  )

  const question = questions[currentQuestion]

  return (
    <div className="quiz-container">
      <div className={animating ? 'slide-out' : 'slide-in'}>
        <p className="question-number">Question {currentQuestion + 1} / {questions.length}</p>
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
  )
}

export default App