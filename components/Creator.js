import { useState } from 'react';
import Create from './create';

const Creator = ({ onClick, isLoggedIn, usrNfo, AuxFunc }) => {
  const [isNewQuizOverlayVisible, setIsNewQuizOverlayVisible] = useState(false);
  const [newQuiz, setnewQuiz] = useState({ title: '', description: '', maxErrors: 0 });
  const [Error, setError] = useState({ isError: false, message: "" });

  const handleNewQuizTitleChange = (event) => {
    setnewQuiz({ ...newQuiz, title: event.target.value });
  };

  const handleNewQuizDescriptionChange = (event) => {
    setnewQuiz({ ...newQuiz, description: event.target.value });
  };

  const handleMaxErrorsChange = (event) => {
    setnewQuiz({ ...newQuiz, maxErrors: Number(event.target.value) });
  };

  const handleClickCreate = () => {
    if (newQuiz.title === "") {
      console.log(newQuiz)
      setError({ isError: true, message: "Empty Title" });
      return;
    }
    if (newQuiz.description === "") {
      setError({ isError: true, message: "Empty Description" });
      return;
    }
    setIsNewQuizOverlayVisible(!isNewQuizOverlayVisible);
  }

  const inputColors = (condition = false) => {
    return (Error.isError && condition) ? "outline -outline-offset-2 outline-orange-400 w-full mb-4 p-2 placeholder-orange-600 text-black" : "w-full mb-4 p-2 text-black";
  }

  return (
    <div className="bg-red-600 text-white p-6 rounded-lg my-4 w-full shadow-[-4px_6px_10px_-2px_rgba(0,0,0,0.25)]">
      {isLoggedIn ? (
        <div className="flex flex-col">
          <h2 className="text-2xl mb-4">Create your own Quiz!</h2>
          <div className="flex">
            <input onChange={handleNewQuizTitleChange} type="text" className={inputColors(Error.message == "Empty Title")} placeholder="Insert a title" />
            <input onChange={handleMaxErrorsChange} type="number" className="mb-4 ml-4 p-2 text-black w-2/5" placeholder="Max errors" min="0" />
          </div>
          <textarea onChange={handleNewQuizDescriptionChange} className={inputColors(Error.message == "Empty Description")} placeholder="Insert a description" rows="4"></textarea>
          <div className="flex justify-center"> {/* Added flex justify-center to center the button */}
            <button className="bg-white text-red-600 py-2 px-4 rounded" onClick={handleClickCreate}>
              Begin
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl mb-4 max-w-72">Login to create your own Quiz!</h2>
        </div>
      )}
      {
        isNewQuizOverlayVisible && usrNfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <Create onClick={() => { setIsNewQuizOverlayVisible(!isNewQuizOverlayVisible); }} newQuiz={newQuiz} User={usrNfo} AuxFunc={AuxFunc} />
          </div>
        )
      }
    </div>
  );
};

export default Creator;