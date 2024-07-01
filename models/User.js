
// Define the User class
class User {
  constructor(username, password, quizPlayed, correctAnswers, quizCreated, playedOwnQuiz) {
    this.username = username
    this.password = password
    this.quizPlayed = quizPlayed
    this.correctAnswers = correctAnswers
    this.quizCreated = quizCreated
    this.playedOwnQuiz = playedOwnQuiz
  }
}
export default User;