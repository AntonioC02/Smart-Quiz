import React, {useEffect} from 'react';

const Stats = ({ User }) => {
    useEffect(() => {
        // Check for user updates
    }, [User]);

    return (
        <div className="text-xl">
            {User ? (
                <>
                    <p>{User.quizPlayed} quizzes played</p>
                    <p>{User.correctAnswers} correct answers</p>
                    <p>{User.quizCreated} quizzes created</p>
                    <p>{User.playedOwnQuiz} played your quizzes</p>
                </>
            ) : (
                <div />
            )}
        </div>
    );
};



const Sidebar = ({ isLoggedIn = false, User }) => {
    return (
        <div className="bg-opacity-100 text-white p-4 mt-10 max-w-80">
            <h2 className="text-2xl mb-4">Your Stats</h2>
            {
                isLoggedIn ? (
                    <Stats User={User} />
                ) : (
                    <p className="text-lg">Please Login to view your stats.</p>
                )}
        </div>
    );
};

export default Sidebar;