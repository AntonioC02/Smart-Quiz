import React, { useState, useEffect } from 'react';
import PopUp from './PopUp';
import Button from './Button';


function shuffleArray(array) {
    return array?.slice(1).sort()
}

export default function viewQuiz({ onClick, Quiz, username, finishAux }) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answer, setAnswer] = useState("");
    const [confirmedAnswers, setConfirmedAnswers] = useState(Array(Quiz?.answers_matrix?.length || 0).fill(null));

    useEffect(() => {
        if (Quiz?.answers_matrix && questionIndex < Quiz?.answers_matrix.length) {
            if (Quiz?.answers_matrix[questionIndex][2] !== "") {
                setSelectedOption(confirmedAnswers[questionIndex]);
            } else {
                setAnswer(confirmedAnswers[questionIndex] || "");
            }
        }
    }, [questionIndex, confirmedAnswers, Quiz?.answers_matrix]);

    const handlePrevious = () => {
        saveAnswer();
        if (questionIndex > 0) {
            setQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleNext = () => {
        saveAnswer();
        if (questionIndex < (Quiz?.answers_matrix?.length || 0) - 1) {
            setQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null);
            setAnswer("");
        }
    };

    const saveAnswer = () => {
        if (Quiz?.answers_matrix && questionIndex < Quiz?.answers_matrix.length) {
            if ((selectedOption !== null && Quiz?.answers_matrix[questionIndex][2] !== "") || (answer !== "" && Quiz?.answers_matrix[questionIndex][2] === "")) {
                const newSelectedOptions = [...confirmedAnswers];
                if (Quiz?.answers_matrix[questionIndex][2] !== "") {
                    newSelectedOptions[questionIndex] = selectedOption;
                } else {
                    newSelectedOptions[questionIndex] = answer;
                }
                setConfirmedAnswers(newSelectedOptions);
            }
        }
    };


    useEffect(() => {
        saveAnswer();
    }, [selectedOption, answer]);

    // Remove the saveAnswer call from the handleFinish function
    const handleFinish = async () => {
        if (questionIndex < (Quiz?.answers_matrix?.length || 0) - 1) {
            setQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null);
            setAnswer("");
        } else {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/quiz/${Quiz?.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ answers: confirmedAnswers, username: username }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update quiz');
                }

                const data = await response.json();
                finishAux(confirmedAnswers, data.finalScore);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="bg-red-600 text-white p-6 rounded-lg my-4 w-3/4 min-h-96 flex flex-col">
            <div className="flex justify-between pb-4">
                <h2 className="text-2xl">{Quiz?.title}</h2>
                <Button text="x" onClick={() => { setIsOverlayVisible(!isOverlayVisible); }} />
            </div>
            <h2 className="text-xl pb-2">Question {questionIndex + 1}</h2>
            <h2 className="text-l pb-2">{Quiz?.answers_matrix?.[questionIndex]?.[0]}</h2>

            {
                Quiz?.answers_matrix?.[questionIndex]?.[2] !== "" ? (
                    <div className="bg-red-600 text-white p-6 rounded-lg my-4 w-full">
                        <div className="grid grid-cols-2 gap-4">
                            {shuffleArray(Quiz?.answers_matrix?.[questionIndex])?.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="ml-2 mr-3">
                                        <label className="relative">
                                            <input
                                                type="radio"
                                                value={option}
                                                checked={selectedOption === option}
                                                onChange={(event) => { setSelectedOption(event.target.value) }}
                                                className="form-radio appearance-none h-4 w-4 border-2 border-red-600 rounded-sm bg-white checked:bg-white checked:border-red-100 focus:outline-none transition duration-200 mt-1 align-top cursor-pointer peer"
                                            />
                                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full h-2 w-2 peer-checked:block hidden"></span>
                                        </label>
                                    </div>
                                    <div className="text-lg text-white">{option}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <input
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        type="text"
                        className="w-full mb-4 p-2 text-black"
                        placeholder="Insert answer"
                    />
                )
            }

            <div className="flex-grow"></div>
            <div className="grid grid-cols-3 grid-rows-1 items-end mb-8">
                <Button disabled={questionIndex == 0} text="<" onClick={handlePrevious} />
                <Button disabled={questionIndex == Quiz?.answers_matrix?.length - 1} text=">" onClick={handleNext} />
                <Button disabled={questionIndex != Quiz?.answers_matrix?.length - 1} text="Finish" onClick={handleFinish} />
            </div>

            {
                isOverlayVisible && (
                    <PopUp title="Quit quiz?" buttonText="quit" onClickClose={() => { setIsOverlayVisible(!isOverlayVisible) }} onClickButton={onClick} />
                )
            }
        </div >
    );

}
