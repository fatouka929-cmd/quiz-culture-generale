
import { useState, useEffect } from 'react'
import { fetchQuestions, shuffleAnswers } from './api'

function App() {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <p>Chargement...</p>

  if (isFinished) return (
    <div>
      <h1>Quiz terminé !</h1>
      <p>Score : {score} / {questions.length}</p>
      <button onClick={() => window.location.reload()}>Rejouer</button>
    </div>
  )

  const question = questions[currentQuestion]

  return (
    <div>
      <h2>Question {currentQuestion + 1} / {questions.length}</h2>
      <p>{question.question}</p>
      {question.shuffledAnswers.map((answer, i) => (
        <button key={i} onClick={() => handleAnswer(answer)}>
          {answer}
        </button>
      ))}
    </div>
  )
}

export default App