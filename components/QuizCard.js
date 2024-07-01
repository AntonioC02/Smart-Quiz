import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiShare } from 'react-icons/fi';

const QuizCard = ({ onClickStart, onClickAnswers, onClickShare, Quiz, User }) => {

  return (
    <div className="bg-red-600 grid grid-rows-3 text-white p-6 rounded-lg w-full max-w-6xl my-4 mr-32 shadow-[4px_6px_10px_-2px_rgba(0,0,0,0.25)]">
      <h2 className="text-2xl">{Quiz?.title}</h2>
      <ReactMarkdown remarkPlugins={[remarkGfm]} children={Quiz?.description} />
      <div className="flex justify-between items-center">
        <div className="bg-red-800 -ml-7 bg-opacity-90 text-white p-2 rounded mt-auto w-auto min-w-56 max-w-64 mr-4 shadow-[4px_6px_10px_-2px_rgba(0,0,0,0.45)]">
          <p className="flex items-center">
            {Quiz ? Quiz?.times_played : 'N/A'} {Quiz?.times_played !== 1 ? 'People' : 'Person'} played this quiz
            <FiShare className="text-white cursor-pointer ml-2" onClick={onClickShare} />
          </p>
        </div>

        <div className="flex space-x-2 items-center">
          {(Quiz?.username === User?.username) &&
            <button onClick={onClickAnswers} className="bg-white mt-auto text-red-600 py-2 px-4 w-36 rounded">
              View Answers
            </button>
          }
          <button onClick={onClickStart} className="bg-white mt-auto text-red-600 py-2 px-4 w-36 rounded">
            Start
          </button>
        </div>
      </div>

    </div>
  );
};

export default QuizCard;
