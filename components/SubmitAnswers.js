import React, { useState } from 'react';
import Button from './Button';
import PopUp from './PopUp';

export default function Answers({ onClick, Quiz, userAnswers, userScore, usernameC }) {
  const [TmpName, setTmpName] = useState("anonymous");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [PopUpText, setPopUpText] = useState("anonymous");

  const showAnswers = userAnswers != undefined;

  const onSubmit = async () => {
    const username = usernameC || TmpName;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          quizId: Quiz.id,
          answerSet: userAnswers,
        }),
      });

      setPopUpText(response.ok ? 'Answers submitted successfully' : 'An error occurred while submitting answers');
      setIsOverlayVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-red-600 text-white p-6 rounded-lg my-4 w-3/4 h-3/4 overflow-y-auto flex flex-col justify-between">
      <div>
        <div className="flex justify-between pb-4">
          <h2 className="text-2xl">{Quiz.title}</h2>
          <Button text="x" onClick={onClick} />
        </div>
        {userAnswers && Quiz.max_errors > 0 && (
          <h2 className="text-2xl mb-4">
            Quiz {Quiz.answers_matrix.length - userScore < Quiz.max_errors ? "Passed" : "Failed"} {Quiz.answers_matrix.length - userScore}/{Quiz.max_errors} Errors.
          </h2>
        )}
        {Quiz.answers_matrix?.map((question, index) => (
          <React.Fragment key={index}>
            <h2 className="text-xl pb-2">{question[0]}</h2>
            {question.slice(1).map((answer, i) => {
              if (!answer) return null;

              const isCorrect = i === 0 && (question[2] || (question[2] === "" && answer === userAnswers[index]));
              const isUserAnswer = answer === userAnswers[index] || question[2] === "" || (userAnswers[index] == null && i === 0);

              return (
                <h2 key={i} className="text-l pb-2">
                  {answer}
                  {showAnswers && (
                    <span className="ml-2 text-sm">
                      {isCorrect ? "V" : isUserAnswer ? "X" : ""}
                    </span>
                  )}
                </h2>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4">
        {usernameC === undefined && userAnswers && (
          <div className="grid grid-rows-2 mb-4">
            <label htmlFor="usernameC" className="text-l pb-2">Guest Username:</label>
            <input
              type="text"
              id="usernameC"
              name="usernameC"
              onChange={(event) => setTmpName(event.target.value)}
              defaultValue="anonymous"
              className="bg-white text-black p-2 rounded-lg w-1/4"
            />
          </div>
        )}
        {userAnswers && (
          <div className="flex justify-center">
            <button className="bg-white text-red-600 py-2 px-4 rounded" onClick={onSubmit}>
              Submit Answers
            </button>
          </div>
        )}
      </div>
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <PopUp title={PopUpText} buttonText="" onClickClose={onClick} />
        </div>
      )}
    </div>
  );
}
