// src/services/quizService.js
let quizzes = [
  {
    id: 1,
    topicId: 1,
    name: 'Mini-quiz: Gia đình',
    type: 'mini',
    passPercentage: 50,
    relatedLessons: [1, 2, 3],
    questionCount: 10,
    questions: []
  }
]

export const fetchQuizzes = () => Promise.resolve(quizzes)

export const fetchQuiz = (id) => {
  return Promise.resolve(quizzes.find(q => q.id === id))
}

export const updateQuiz = (data) => {
  const index = quizzes.findIndex(q => q.id === data.id)
  if (index !== -1) {
    quizzes[index] = { ...quizzes[index], ...data }
  }
  return Promise.resolve(quizzes[index])
}
