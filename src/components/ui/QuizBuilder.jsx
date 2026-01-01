import { escapeHtml } from '../../utils/helpers'

function QuizBuilder({ questions, onChange }) {
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    onChange(newQuestions)
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options[oIndex] = value
    onChange(newQuestions)
  }

  const handleCorrectIndexChange = (qIndex, oIndex) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].correctIndex = oIndex
    onChange(newQuestions)
  }

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    onChange(newQuestions)
  }

  const addQuestion = () => {
    onChange([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      timeLimit: 20
    }])
  }

  return (
    <div className="quiz-builder">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-block">
          <div className="question-header">
            <span className="question-number">Question {qIndex + 1}</span>
            <button
              type="button"
              className="btn-remove-question"
              onClick={() => removeQuestion(qIndex)}
            >
              Supprimer
            </button>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Texte de la question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '8px' }}>
              Temps limite (secondes)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="20"
              value={q.timeLimit || 20}
              onChange={(e) => handleQuestionChange(qIndex, 'timeLimit', parseInt(e.target.value) || 20)}
              min="5"
              max="120"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '8px' }}>
              Réponses (cochez la bonne réponse)
            </label>
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="answer-option">
                <input
                  type="radio"
                  name={`correctIndex-${qIndex}`}
                  checked={q.correctIndex === oIndex}
                  onChange={() => handleCorrectIndexChange(qIndex, oIndex)}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Réponse ${oIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-add-question"
        onClick={addQuestion}
      >
        + Ajouter une question
      </button>
    </div>
  )
}

export default QuizBuilder
