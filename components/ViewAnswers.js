import React, { useEffect, useState } from 'react';
import Button from './Button';

export default function ViewAnswers({ onClick, Quiz }) {
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [userList, setUserList] = useState([]);


  const getUsersAndAnswers = async (quizId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/submit-answers/${quizId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsersAndAnswers(Quiz.id);
      setUserList(data);
      console.log(data)
    };
    fetchData();
  }, [Quiz]);


  return (
    <div className="bg-red-600 text-white p-6 rounded-lg my-4 w-3/4 h-3/4 overflow-y-auto">
      <div className="flex justify-between pb-4">
        <h2 className="text-2xl">{Quiz?.title}</h2>
        <Button text="x" onClick={onClick} />
      </div>
      <div className="flex justify-among pb-4">

        <h2 className="text-2xl">View User Answers:</h2>
        <select
          className="text-black ml-6"
          value={selectedUser?.id}
          onChange={(e) => {
            setSelectedUser(userList.find(user => user.id === Number(e.target.value)));
          }}
        >
          <option value="">All Users</option>
          {userList.map((user, i) => (
            <option key={i} value={user.id}>
              {user.user_username} {user.id == "null" ? "(guest)" : ""}
            </option>
          ))}
        </select>
      </div>


      {Quiz.max_errors > 0 && (selectedUser != undefined) && (
        <h2 className="text-xl mb-4">
          Quiz {Quiz.answers_matrix.length - selectedUser.score <= Quiz.max_errors ? "Passed" : "Failed"} {Quiz.answers_matrix.length - selectedUser.score}/{Quiz.max_errors} Errors.
        </h2>
      )}
      {Quiz?.answers_matrix.map((question, index) => (
        <div key={index}>
          <h2 className="text-2xl pb-2">{question[0]}</h2>
          {question.slice(1).map((answer, i) => {
            if (answer === "") return null;

            const total = Quiz.user_answers_matrix[index].reduce((acc, curr) => acc + curr, 0);
            const percentage = total > 0 ? (Quiz.user_answers_matrix[index][i] / total) * 100 : 0;

            return (
              <h2 key={i} className="text-l pb-2">
                {answer}
                {(selectedUser == undefined) && <span className="ml-2 text-sm">{percentage.toFixed(2)}%</span>}
                {(selectedUser != undefined) && <span className="ml-2 text-sm">
                  {(i === 0 && (question[2] !== "" || (question[2] === "" && answer === selectedUser?.user_answers?.[index])) && selectedUser?.user_answers?.[index] != null) ? "V" :
                    (answer === selectedUser?.user_answers?.[index] || question[2] === "" || (selectedUser?.user_answers?.[index] === null && i === 0)) ? "X" : ""}
                </span>}

              </h2>
            );
          })}
        </div>
      ))}
    </div>
  );
}
