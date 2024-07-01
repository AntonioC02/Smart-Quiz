import { useState, useEffect } from 'react';
import QuizCard from '../components/QuizCard';
import Sidebar from '../components/Sidebar';
import Creator from '../components/Creator';
import Login from '../components/Login';
import Logo from '../components/Logo';
import Quiz from "../models/Quiz";
import LoginPage from '../components/LoginPage';
import SubmitAnswers from '../components/SubmitAnswers';
import ViewAnswers from '../components/ViewAnswers';
import View from '../components/viewQuiz';
import Share from '../components/Share';
import Button from '../components/Button';

export default function Home() {
    const [isSubmitAnswersOverlayVisible, setisSubmitAnswersOverlayVisible] = useState(false);
    const [isViewAnswersOverlayVisible, setisViewAnswersOverlayVisible] = useState(false);
    const [isViewQuizOverlayVisible, setIsViewQuizOverlayVisible] = useState(false);
    const [isShareOverlayVisible, setIsShareOverlayVisible] = useState(false);
    const [isLoginOverlayVisible, setisLoginOverlayVisible] = useState(false);
    const [update, setupdate] = useState(false);
    const [selectedQuiz, setselectedQuiz] = useState(new Quiz());
    const [usrNfo, setusrNfo] = useState(undefined);
    const [login, setlogin] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [usrAns, setusrAns] = useState(undefined);
    const [usrScore, setusrScore] = useState(undefined);

    useEffect(() => {
        setlogin(usrNfo !== undefined)
    }, [usrNfo]);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch('/api/user-stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error; // Rethrow the error to handle it upstream
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                if (data) {
                    setusrNfo(data.user); // Assuming setusrNfo is your state setter
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/quizzes');
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes');
                }
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        loadUserData();
        fetchQuizzes();
    }, [update]);

    return (
        <div className="relative">
            <div className="min-h-screen bg-gray-100 flex">
                <aside className="bg-red-800 bg-opacity-100 text-white p-4 w-70">
                    <Sidebar isLoggedIn={login} User={usrNfo} />
                </aside>
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center my-4">
                        <Logo />
                        <Login onClick={() => {
                            setisLoginOverlayVisible(!isLoginOverlayVisible);
                        }} isLoggedIn={login} User={usrNfo} />
                    </div>
                    <div className="flex justify-between items-start">
                        <div className="flex-1 flex-col w-flex">
                            <div className="flex flex-wrap min-w-[600px]">
                                {quizzes?.map((quiz, index) => (
                                    <QuizCard key={index}
                                        User={usrNfo}
                                        Quiz={quiz}
                                        onClickShare={() => {
                                            setselectedQuiz(quiz);
                                            setIsShareOverlayVisible(!isShareOverlayVisible);
                                        }}
                                        onClickStart={() => {
                                            setselectedQuiz(quiz);
                                            setIsViewQuizOverlayVisible(!isViewQuizOverlayVisible);
                                        }}
                                        onClickAnswers={() => {
                                            setselectedQuiz(quiz);
                                            setisViewAnswersOverlayVisible(!isViewAnswersOverlayVisible);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-00 pl-6">
                            <Creator isLoggedIn={login} onClick={() => { }} usrNfo={usrNfo} AuxFunc={() => { setusrNfo({ ...usrNfo, quizCreated: usrNfo.quizCreated + 1 }); }} />
                        </div>
                    </div>
                </main>
            </div>

            {isViewQuizOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <View username={usrNfo?.username} onClick={() => { setIsViewQuizOverlayVisible(!isViewQuizOverlayVisible); }} Quiz={selectedQuiz} finishAux={(answers, score) => { setusrScore(score); if (usrNfo != undefined) { setusrNfo({ ...usrNfo, quizPlayed: usrNfo.quizPlayed + 1, correctAnswers: usrNfo.correctAnswers + score }); } setusrAns(answers); setIsViewQuizOverlayVisible(!isViewQuizOverlayVisible); setisSubmitAnswersOverlayVisible(!isSubmitAnswersOverlayVisible); }} />
                </div>
            )}

            {isSubmitAnswersOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <SubmitAnswers onClick={() => { setisSubmitAnswersOverlayVisible(!isSubmitAnswersOverlayVisible); setusrAns(undefined); setusrScore(undefined); }} Quiz={selectedQuiz} userAnswers={usrAns} userScore={usrScore} usernameC={usrNfo?.username} />
                </div>
            )}

            {isViewAnswersOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <ViewAnswers onClick={() => { setisViewAnswersOverlayVisible(!isViewAnswersOverlayVisible); setusrAns(undefined); setusrScore(undefined); }} Quiz={selectedQuiz} userAnswers={usrAns} userScore={usrScore} usernameC={usrNfo?.username} />
                </div>
            )}

            {isLoginOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <LoginPage isLoggedIn={login}
                        handleLogout={() => {
                            setusrNfo(undefined);
                            setisLoginOverlayVisible(!isLoginOverlayVisible);
                            localStorage.removeItem('token');
                        }}
                        onClickClose={() => { setisLoginOverlayVisible(!isLoginOverlayVisible); }}
                        handleLoginSuccess={() => {
                            setisLoginOverlayVisible(!isLoginOverlayVisible);
                            setupdate(!update)
                        }} />
                </div>
            )}

            {isShareOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <Share onClickClose={() => { setIsShareOverlayVisible(!isShareOverlayVisible) }} Quiz={selectedQuiz} />
                </div>
            )}

        </div>
    );
}