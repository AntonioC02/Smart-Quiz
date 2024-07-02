import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import LoginPage from '../../components/LoginPage';
import Creator from '../../components/Creator';
import Login from '../../components/Login';
import Logo from '../../components/Logo';
import Quiz from "../../models/Quiz";
import Answers from '../../components/SubmitAnswers';
import View from '../../components/viewQuiz';

export default function Home() {
    const [isViewAnswersOverlayVisible, setisViewAnswersOverlayVisible] = useState(false);
    const [isViewQuizOverlayVisible, setIsViewQuizOverlayVisible] = useState(true);
    const [isLoginOverlayVisible, setisLoginOverlayVisible] = useState(true);
    const [selectedQuiz, setselectedQuiz] = useState(new Quiz());
    const [usrNfo, setusrNfo] = useState(undefined);
    const [update, setupdate] = useState(false);
    const [usrScore, setusrScore] = useState(undefined);
    const [login, setlogin] = useState(false);
    const [usrAns, setusrAns] = useState(undefined);
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        setlogin(usrNfo !== undefined)
    }, [usrNfo]);


    useEffect(() => {
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

        loadUserData();
    }, [update]);


    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/quiz/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz');
                }
                const data = await response.json();
                setselectedQuiz(data);

            } catch (error) {
                console.error(error);
            }
        };
        if (id) {
            fetchQuiz();
        }
    }, [id]);

    return (
        <div className="relative">
            <div className="min-h-screen bg-gray-100 flex">
                <aside className="bg-red-800 bg-opacity-100 text-white p-4 w-70">
                    <Sidebar isLoggedIn={login} User={usrNfo} />
                </aside>
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center my-4">
                        <Logo />
                        <Login isLoggedIn={login} User={usrNfo} />
                    </div>
                    <div className="flex justify-between items-start">
                        <div className="flex-1 flex-col w-flex">
                            <div className="flex flex-wrap min-w-[600px]">

                            </div>
                        </div>
                        <div className="w-00 pl-6">
                            <Creator isLoggedIn={login} onClick={() => { }} usrNfo={usrNfo} />
                        </div>
                    </div>
                </main>
            </div>

            {isViewQuizOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <View username={usrNfo?.username} onClick={() => { router.push("/") }} Quiz={selectedQuiz} finishAux={(answers, score) => { setusrScore(score); if (usrNfo != undefined) { setusrNfo({ ...usrNfo, quizPlayed: usrNfo.quizPlayed + 1, correctAnswers: usrNfo.correctAnswers + score }); } setusrAns(answers); setIsViewQuizOverlayVisible(!isViewQuizOverlayVisible); setisViewAnswersOverlayVisible(!isViewAnswersOverlayVisible); }} />
                </div>
            )}

            {isViewAnswersOverlayVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <Answers onClick={() => { router.push("/"); }} Quiz={selectedQuiz} userAnswers={usrAns} userScore={usrScore} usernameC={usrNfo?.username} />
                </div>
            )}

            {(isLoginOverlayVisible && !login) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <LoginPage guestmode={true} isLoggedIn={login}
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
        </div>
    );
}