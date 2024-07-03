import React, { useState, useEffect } from 'react';
import Button from './Button';
import Quiz from '../models/Quiz';
import PopUp from './PopUp';

export default function Create({ onClick, newQuiz, User, AuxFunc }) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const initialAnswers = [['', '', '', '', '']];
    const [answers, setAnswers] = useState(initialAnswers);
    const [choiceM, setChoiceM] = useState(true);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [Error, setError] = useState({ isError: false, message: "" });

    useEffect(() => {
        if (questionIndex >= answers.length) {
            setAnswers(prevAnswers => [...prevAnswers, ['', '', '', '', '']]);
        }
    }, [questionIndex, answers.length]);

    const handleQuestionChange = (event) => {
        const newQuestion = event.target.value;
        updateAnswers(questionIndex, newQuestion, answers[questionIndex][1], answers[questionIndex][2], answers[questionIndex][3], answers[questionIndex][4]);
    };

    const handleChange = (event) => {
        const newCorrectAnswer = event.target.value;
        updateAnswers(questionIndex, answers[questionIndex][0], newCorrectAnswer, answers[questionIndex][2], answers[questionIndex][3], answers[questionIndex][4]);
    };

    const handleChange1 = (event) => {
        const newAnswer1 = event.target.value;
        updateAnswers(questionIndex, answers[questionIndex][0], answers[questionIndex][1], newAnswer1, answers[questionIndex][3], answers[questionIndex][4]);
    };

    const handleChange2 = (event) => {
        const newAnswer2 = event.target.value;
        updateAnswers(questionIndex, answers[questionIndex][0], answers[questionIndex][1], answers[questionIndex][2], newAnswer2, answers[questionIndex][4]);
    };

    const handleChange3 = (event) => {
        const newAnswer3 = event.target.value;
        updateAnswers(questionIndex, answers[questionIndex][0], answers[questionIndex][1], answers[questionIndex][2], answers[questionIndex][3], newAnswer3);
    };

    const updateAnswers = (index, question, correct, answer1, answer2, answer3) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index] = [question, correct, answer1, answer2, answer3];
            return updatedAnswers;
        });
    };

    const handlePrevious = () => {
        if (questionIndex > 0) {
            const [question, correctAnswer, answer1, answer2, answer3] = answers[questionIndex];
            if (question === "" || correctAnswer === "" || (!choiceM && (answer1 === "" || answer2 === "" || answer3 === ""))) {
                updateAnswers(questionIndex, '', '', '', '', '');
            }
            setQuestionIndex(prevIndex => prevIndex - 1);
            setError({isError:false,message:"null"});
        }
    };

    const handleNext = () => {
        const [question, correctAnswer, answer1, answer2, answer3] = answers[questionIndex];

        if (question === "") {
            setError({ isError: true, message: "Empty Question" });
            return;
        }

        if (correctAnswer === "") {
            setError({ isError: true, message: "Empty Answer" });
            return;
        }

        if (choiceM && ((answer1 === "" || answer2 === "" || answer3 === "")) || (new Set([correctAnswer, answer1, answer2, answer3])).size !== 4) {
            setError({ isError: true, message: "MAnswers Incomplete" });
            return;
        }


        if (question !== "" && correctAnswer !== "" && (!choiceM || (answer1 !== "" && answer2 !== "" && answer3 !== ""))) {
            setQuestionIndex(prevIndex => prevIndex + 1);
            setError({isError:false,message:"null"});
        }
    };
    const handleFinish = async () => {
        try {
            const [question, correctAnswer, answer1, answer2, answer3] = answers[questionIndex];

            if (question === "") {
                setError({ isError: true, message: "Empty Question" });
                return;
            }

            if (correctAnswer === "") {
                setError({ isError: true, message: "Empty Answer" });
                return;
            }

            if (choiceM && ((answer1 === "" || answer2 === "" || answer3 === "")) || (new Set([correctAnswer, answer1, answer2, answer3])).size !== 4) {
                setError({ isError: true, message: "MAnswers Incomplete" });
                return;
            }

            const filteredAnswers = answers.slice(0, questionIndex + 1).filter((questionData) => {
                const [question, correctAnswer, answer1, answer2, answer3] = questionData;
                return question !== "" && correctAnswer !== "" && (!choiceM || (answer1 !== "" && answer2 !== "" && answer3 !== ""));
            });

            let tempuseranswermatrix = [];
            for (let i = 0; i < filteredAnswers.length; i++) {
                tempuseranswermatrix.push([0, 0, 0, 0]);
            }

            const finishedQuiz = new Quiz(null, newQuiz.title, newQuiz.description, newQuiz.maxErrors, filteredAnswers, 0, tempuseranswermatrix, User.username);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(finishedQuiz),
            });

            if (!response.ok) {
                setError({ isError: true, message: "Failed to create quiz" });
                return;
            }

            const data = await response.json();
            AuxFunc();
            onClick(finishedQuiz);
        } catch (error) {
            console.error(error);
        }
    };

    const inputColors = (condition = false) => {
        return (Error.isError && condition) ? "outline -outline-offset-2 outline-orange-400 w-full mb-4 p-2 text-black" : "w-full mb-4 p-2 text-black";
    }

    const labelColors = (condition = false) => {
        return (Error.isError && condition) ? " text-orange-400" : "text-l";
    }

    const labelMessage = (expMessage, defLabel) => {
        if (Error.message == expMessage) {
            switch (Error.message) {
                case "Empty Question":
                    return defLabel + " is empty";
                case "Empty Answer":
                    return "Answer is empty";
                case "MAnswers Incomplete":
                    return "All Answers must be Filled And Distinct";
                default:
                    return "Error";
            }
        }
        return defLabel;
    }

    return (
        <div className="bg-red-600 text-white p-6 rounded-lg my-4 w-3/4 h-3/4 flex flex-col justify-between">

            <div className="flex justify-between pb-4">
                <h2 className="text-2xl">{newQuiz.title}</h2>
                <Button text="x" onClick={() => { setIsOverlayVisible(!isOverlayVisible); }} />
            </div>
            <div>
                <h2 className={labelColors(Error.message == "Empty Question") + " text-2xl"}>{labelMessage("Empty Question", `Question ${questionIndex + 1}`)}</h2>
                <input
                    value={answers[questionIndex] ? answers[questionIndex][0] : ''}
                    onChange={handleQuestionChange}
                    type="text"
                    className={inputColors(Error.message == "Empty Question")}
                    placeholder="Insert question"
                />
            </div>
            <div>
                <h2 className={labelColors(Error.message == "Empty Answer") + " text-xl"}>{labelMessage("Empty Answer", "Correct Answer")}</h2>
                <input
                    value={answers[questionIndex] ? answers[questionIndex][1] : ''}
                    onChange={handleChange}
                    type="text"
                    className={inputColors(Error.message == "Empty Answer")}
                    placeholder="Insert correct answer"
                />
            </div>
            <div>
                <div className="grid grid-cols-2 grid-rows-1 items-end mb-4">
                    <h2 className="text-l">Multiple choice Answer?</h2>
                    <Button
                        text={choiceM ? "X" : "O"}
                        onClick={() => setChoiceM(!choiceM)}
                    />
                </div>
                {choiceM && (
                    <div>
                        <h2 className={labelColors(Error.message == "MAnswers Incomplete")}>{labelMessage("MAnswers Incomplete", "Wrong Answers")}</h2>
                        <input
                            value={answers[questionIndex] ? answers[questionIndex][2] : ''}
                            onChange={handleChange1}
                            type="text"
                            className={inputColors(Error.message == "MAnswers Incomplete")}
                            placeholder="Insert answer"
                        />
                        <input
                            value={answers[questionIndex] ? answers[questionIndex][3] : ''}
                            onChange={handleChange2}
                            type="text"
                            className={inputColors(Error.message == "MAnswers Incomplete")}
                            placeholder="Insert answer"
                        />
                        <input
                            value={answers[questionIndex] ? answers[questionIndex][4] : ''}
                            onChange={handleChange3}
                            type="text"
                            className={inputColors(Error.message == "MAnswers Incomplete")}
                            placeholder="Insert answer"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-between mx-64 my-16">
                <Button disabled={questionIndex == 0} text="<" onClick={handlePrevious} />
                <Button text=">" onClick={handleNext} />
                <Button text="Finish" onClick={handleFinish} />
            </div>
            {isOverlayVisible && (
                <PopUp title="Quit Creation?" buttonText="quit" onClickClose={() => { setIsOverlayVisible(!isOverlayVisible) }} onClickButton={onClick} />
            )}
        </div>
    );

}