import React from 'react';
import Button from '../components/Button';

const PopUp = ({ title, buttonText = "", onClickClose, onClickButton = undefined }) => (
  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
    {/* Your popup content goes here */}
    <div className="flex flex-fill text-white p-6 rounded-lg items-center content-center">
      <div className="bg-red-800 text-white p-6 rounded-lg max-w-64">
        <div className="flex justify-between pb-4">
          <h2 className="text-2xl">{title}</h2>
          <Button text="x" onClick={onClickClose} />
        </div>
        {(buttonText != "") ? (
          <button onClick={onClickButton} className="bg-white text-red-600 py-2 px-4 rounded">
            {buttonText}
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  </div>
);

export default PopUp;