
// Define the Quiz class

export default class Quiz {
  constructor(id, title, description, max_errors = 0, answersMatrix, timesPlayed = 0, user_answers_matrix, user_id) {
    this.id = id || null;
    this.title = title;
    this.description = description;
    this.max_errors = max_errors;
    this.answersMatrix = answersMatrix;
    this.timesPlayed = timesPlayed;
    this.user_answers_matrix = user_answers_matrix;
    this.user_id = user_id;
  }
 
}