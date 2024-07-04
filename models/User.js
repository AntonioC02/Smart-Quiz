
// Define the User class
class User {
  constructor(id = -1, username, password, quizPlayed, correctAnswers, quizCreated, playedOwnQuiz) {
    this.id = id
    this.username = username
    this.password = password
    this.quizPlayed = quizPlayed
    this.correctAnswers = correctAnswers
    this.quizCreated = quizCreated
    this.playedOwnQuiz = playedOwnQuiz
  }
}
export default User;