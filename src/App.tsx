import { useState, useEffect } from 'react'
import { fetchQuestions, shuffleAnswers } from './Api.tsx'
import './App.css'
import confetti from 'canvas-confetti'

interface Question {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  shuffledAnswers: string[]
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

  const handleReplay = () => {
    setScore(0)
    setCurrentQuestion(0)
    setIsFinished(false)
    setLoading(true)
    setGameStarted(false)
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
)}

export default App