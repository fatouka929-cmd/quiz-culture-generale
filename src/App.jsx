
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

  const [difficulty, setDifficulty] = useState('easy')
  const [category, setCategory] = useState('9')


  const handleReplay = () => {
  setScore(0)
  setCurrentQuestion(0)
  setIsFinished(false)
  setLoading(true)
  setGameStarted(false)
}
  
  useEffect(() => {
    fetchQuestions(difficulty, category).then(data => {
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