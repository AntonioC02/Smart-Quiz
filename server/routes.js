import express from 'express';
import User from '../models/User.js';
import UserQuizAnswer from '../models/UserQuizAnswer.js';
import pool from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const jwtSecret = 'N86004207';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


router.post('/login', express.json(), async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ user_id: user.id }, jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

const saltRounds = 10;

router.post('/register', express.json(), async (req, res) => {
    const { username, password } = req.body;

    try {

        if (!password || password === "") {
            return res.status(400).json({ error: 'Password cannot be empty' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User(-1, username, hashedPassword, 0, 0, 0, 0);
        const query = 'INSERT INTO users (username, password, quiz_played, correct_answers, quiz_created, played_own_quiz) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [newUser.username, newUser.password, newUser.quizPlayed, newUser.correctAnswers, newUser.quizCreated, newUser.playedOwnQuiz];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.code === '23505' || err.constraint === 'unique_violation') {
            res.status(409).json({ error: 'User Exists' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while registering the user' });
        }
    }
});

router.get('/quizzes', express.json(), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM quizzes');
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No quizzes found.' });
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching quizzes' });
    }
});


router.post('/submit-answers', express.json(), async (req, res) => {
    const { userid, username, quizId, answerSet , score} = req.body;
    const answerSet2 = JSON.stringify(answerSet);
    try {
        const newUserQuizAnswer = new UserQuizAnswer(username, quizId, userid, answerSet2, score);
        const query = 'INSERT INTO user_quiz_answers (user_username, user_id, quiz_id, user_answers, score) VALUES ($1, $2, $3, $4, $5)';
        const values = [newUserQuizAnswer.username, newUserQuizAnswer.userId, newUserQuizAnswer.quizId, answerSet2, score];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'User quiz answers submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while submitting the user quiz answers' });
    }
});

router.get('/quiz/:id', express.json(), async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Quiz not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the quiz' });
    }
});

router.get('/submit-answers/:quizId', express.json(), async (req, res) => {
    const quizId = req.params.quizId;

    try {
        const result = await pool.query(
            'SELECT id, user_id, user_username, user_answers, score FROM user_quiz_answers WHERE quiz_id = $1',
            [quizId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.put('/quiz/:id', express.json(), async (req, res) => {
    const quizId = req.params.id;
    const { answers, user_id } = req.body;

    let score = []

    try {
        const result = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
        const quiz = result.rows[0];
        let finalscore = 0;
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        answers.forEach((answer, index) => {
            let ix = quiz.answers_matrix[index].slice(1).indexOf(answer)

            if (ix < 0 && quiz.answers_matrix[index][2] == "") { ix = 1 }
            score.push([
                ix == 0 ? 1 : 0,
                ix == 1 ? 1 : 0,
                ix == 2 ? 1 : 0,
                ix == 3 ? 1 : 0
            ])
            if (ix == 0) finalscore++;
        });

        if (quiz.user_answers_matrix.length === score.length && quiz.user_answers_matrix.every((row, i) => row.length === score[i].length)) {
            quiz.user_answers_matrix = quiz.user_answers_matrix.map((row, i) => row.map((col, j) => col + score[i][j]));
        } else {
            console.log("The matrices have different sizes and cannot be summed.");
        }

        const updatedUserAnswersMatrix = JSON.stringify(quiz.user_answers_matrix);
        await pool.query('UPDATE quizzes SET user_answers_matrix = $1, times_played = times_played + 1 WHERE id = $2', [updatedUserAnswersMatrix, quizId]);
        if (user_id) {
            const queryText = 'UPDATE users SET quiz_played = quiz_played + 1, correct_answers = correct_answers + $2 WHERE id = $1';
            const queryParams = [user_id, finalscore];
        
            await pool.query(queryText, queryParams);     
        }
        res.status(200).json({ message: 'Quiz updated successfully', finalScore: finalscore });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the quiz' });
    }
});

router.get('/user-stats', authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    try {
        const userResult = await pool.query('SELECT  id, username, quiz_played, correct_answers, quiz_created, played_own_quiz  FROM users WHERE id = $1', [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = userResult.rows[0];

        const quizzesResult = await pool.query('SELECT SUM(times_played) AS played_own_quiz FROM quizzes WHERE user_id = $1', [user_id]);
        const playedOwnQuiz = quizzesResult.rows[0].played_own_quiz || 0;

        await pool.query('UPDATE users SET played_own_quiz = $1 WHERE id = $2', [playedOwnQuiz, user_id]);

        user.played_own_quiz = playedOwnQuiz;

        const userObj = new User(user.id, user.username, "", user.quiz_played, user.correct_answers, user.quiz_created, user.played_own_quiz)
        res.json({ user: userObj });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});



router.post('/quiz', authenticateToken, express.json(), async (req, res) => {
    const { title, description, max_errors, answersMatrix, user_answers_matrix } = req.body;
    const { user_id } = req.user;

    const answers = JSON.stringify(answersMatrix);
    const userAnswers = JSON.stringify(user_answers_matrix);
    const zero = 0;

    try {
        const query = 'INSERT INTO quizzes (title, description, max_errors, answers_matrix, times_played, user_answers_matrix, user_id) VALUES ($1, $2, $3, $4 ,$5, $6, $7)';
        const values = [title, description, max_errors, answers, zero, userAnswers, user_id];

        const result = await pool.query(query, values);

        await pool.query('UPDATE users SET quiz_created = quiz_created + 1 WHERE id = $1', [user_id]);

        res.status(201).json({ message: 'Quiz created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the quiz' });
    }
});


export default router;
