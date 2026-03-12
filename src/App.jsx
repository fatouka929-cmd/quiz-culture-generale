
import { useState, useEffect } from 'react'
import { fetchQuestions, shuffleAnswers } from './Api.jsx'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  useEffect(() => {
    fetchQuestions().then(data => {
      const withShuffled = data.map(q => ({
        ...q,
        shuffledAnswers: shuffleAnswers(q)
      }))
      setQuestions(withShuffled)
      setLoading(false)
    })
  }, [])

  function handleAnswer(answer) {
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1)
    }
    if (currentQuestion + 1 >= questions.length) {
      setIsFinished(true)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  if (!gameStarted) return (
    <div className="quiz-container score-screen">
      <h1 className="accueil-titre">🧠 Quiz Culture Générale</h1>
      <p className="accueil-description">Pour ceux qui veulent en savoir plus, chaque jour.</p>
      <button className="replay-btn" onClick={() => setGameStarted(true)}>
        Commencer 🚀
      </button>
    </div>
  )

  if (loading) return <p>Chargement...</p>

  if (isFinished) return (
    <div className='quiz-container'>
      <h1>Quiz terminé !</h1>
      <div className='score-number'>Score : {score} / {questions.length}</div>
      <p className='bien-joue'>Bien joué ! 🎉</p>
<button className='replay-btn' onClick={() => {
  setScore(0)
  setCurrentQuestion(0)
  setIsFinished(false)
  setLoading(true)
  fetchQuestions().then(data => {
    const withShuffled = data.map(q => ({
      ...q,
      shuffledAnswers: shuffleAnswers(q)
    }))
    setQuestions(withShuffled)
    setLoading(false)
  })
}}>
  Rejouer 🔄</button>
    </div>
  )

  const question = questions[currentQuestion]

  return (
    <div className="quiz-container">
      <p className="question-number">Question {currentQuestion + 1} / {questions.length}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(currentQuestion / questions.length) * 100}%` }}></div>
      </div>
      <p className='question-text'>{question.question}</p>
      <div className='answers-grid'>
        {question.shuffledAnswers.map((answer, i) => (
          <button key={i} className='answer-btn' onClick={() => handleAnswer(answer)}>
            {answer}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App