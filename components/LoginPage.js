import Button from './Button';
import PopUp from './PopUp';
import User from "../models/User";
import { useState } from 'react';

export default function LoginPage({ onClickClose, handleLoginSuccess, handleLogout, isLoggedIn, guestmode = false }) {
    const [tmpusrNfo, settmpusrNfo] = useState(new User("", "", 0, 0, 0, 0));
    const [confirmPw, setconfirmPw] = useState("");
    const [Error, setError] = useState({ isError: false, message: "" });
    const [isRegister, setIsRegister] = useState(false);

    function handleUsernameChange(event) {
        tmpusrNfo.username = event.target.value;
    }

    function handlePasswordChange(event) {
        tmpusrNfo.password = event.target.value;
    }

    const handleClickLogin = async () => {
        try {
            if (tmpusrNfo.username === "") {
                setError({ isError: true, message: "Empty User" });
                return;
            }
            if (tmpusrNfo.password === "") {
                setError({ isError: true, message: "Empty Password" });
                return;
            }
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tmpusrNfo),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            handleLoginSuccess();
        } catch (error) {
            console.error(error);
            setError({ isError: true, message: error.message });
        }
    };

    const handleClickRegister = async () => {
        try {
            if (tmpusrNfo.username === "") {
                setError({ isError: true, message: "Empty User" });
                return;
            }
            if (tmpusrNfo.password === "") {
                setError({ isError: true, message: "Empty Password" });
                return;
            }
            if (tmpusrNfo.password !== confirmPw) {
                setError({ isError: true, message: "Passwords Differ" });
                return;
            }
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tmpusrNfo),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    setError({ isError: true, message: "User Exists" });
                } else {
                    throw new Error("Failed to create User");
                }
                return;
            }

            await handleClickLogin();
        } catch (error) {
            console.error(error);
            setError({ isError: true, message: error.message });
        }
    };


    const inputColors = (condition = false) => {
        return (Error.isError && condition) ? "outline -outline-offset-2 outline-orange-400 w-full mb-4 p-2 text-black" : "w-full mb-4 p-2 text-black";
    }

    const labelColors = (condition = false) => {
        return (Error.isError && condition) ? "text-l text-orange-400" : "text-l";
    }

    const labelMessage = (expMessage, defLabel) => {
        if (Error.message == expMessage || (expMessage == "User Error" && (Error.message == "Empty User" || Error.message == "User Exists"))) {
            switch (Error.message) {
                case "Empty User":
                    return "User field is empty";
                case "User Exists":
                    return "User already exists";
                case "Passwords Differ":
                    return "Passwords do not match";
                case "Empty Password":
                    return "Password field is empty";
                default:
                    return "Error";
            }
        }
        return defLabel;
    }

    return (
        <>
            {isLoggedIn ?
                <PopUp onClickClose={onClickClose} title="LogOut?" buttonText="Confirm" onClickButton={handleLogout} />
                : (
                    <div className="bg-red-600 text-white p-6 items-center content-center rounded-lg my-4 w-1/4">

                        <div className="flex justify-between pb-4">
                            <h2 className="text-2xl">{isRegister ? 'Register' : 'Login'}</h2>
                            <Button text="x" onClick={onClickClose} />
                        </div>
                        <h2 className={labelColors(Error.message == "User Exists" || Error.message == "Empty User")}>  {labelMessage("User Error", (isRegister) ? "New Account Username" : "Username")}</h2>
                        <input onChange={handleUsernameChange} type="text" className={inputColors(Error.message == "User Exists" || Error.message == "Empty User")} placeholder="Insert your Username" />
                        <h2 className={labelColors(Error.message == "Empty Password")}>{labelMessage("Empty Password", (isRegister) ? "New Account Password" : "Password")}</h2>
                        <input onChange={handlePasswordChange} type="password" className={inputColors(Error.message == "Empty Password")} placeholder="Insert your Password" />
                        {isRegister ? (
                            <>
                                <h2 className={labelColors(Error.message == "Passwords Differ")}>{labelMessage("Passwords Differ", "Confirm Password")} </h2>
                                <input type="password" className={inputColors(Error.message == "Passwords Differ")} placeholder="Confirm your Password" onChange={(event) => {
                                    setconfirmPw(event.target.value)
                                }} />
                            </>
                        ) : (
                            <>
                            </>
                        )}
                        <div className="flex justify-center">
                            <button onClick={(isRegister) ? handleClickRegister : handleClickLogin} className="bg-white text-red-600 py-2 px-4 max-h-10  m-2 rounded">Confirm</button>
                        </div>
                        <div className="flex justify-center">
                            <p onClick={() => setIsRegister(!isRegister)} className="text-white cursor-pointer">{(!isRegister) ? "Create a new Account" : "Back to Login"}</p>
                        </div>
                        {guestmode ? (
                            <div className="flex justify-center mt-4">
                                <button onClick={onClickClose} className="bg-white text-red-600 py-2 px-4 max-h-10 mb-2 rounded">Continue As Guest</button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
        </>
    );

}