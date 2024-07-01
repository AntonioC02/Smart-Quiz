export default class UserQuizAnswer {
  constructor(username, quizId, answerSet, score) {
    this.username = username;
    this.quizId = quizId;
    this.answerSet = answerSet;
    this.score = score;
  }
}