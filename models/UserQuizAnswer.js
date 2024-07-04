export default class UserQuizAnswer {
  constructor(username, quizId, userId, answerSet, score) {
    this.username = username;
    this.quizId = quizId;
    this.userId = userId;
    this.answerSet = answerSet;
    this.score = score;
  }
}