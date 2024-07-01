import Image from 'next/image';

const Login = ({ isLoggedIn = false, User, onClick }) => {
    return (
        <div style={{ margin: 0, padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isLoggedIn ? (
                    <p className="text-lg my-1" >Hello, {User?.username}!</p>
                ) : (
                    <p className="text-lg my-1">Welcome!</p>
                )}
                {isLoggedIn ? (
                    <div onClick={onClick} className="rounded ml-4 min-w-10">
                                <Image src="/User.svg" alt="User Icon" className="w-10 h-10 block m-0 p-0"/>
                    </div>
                ) : (
                    <button onClick={onClick} className="bg-white text-red-600 py-2 px-4 rounded" style={{ marginLeft: '10px' }}>Login</button>
                )}
            </div>
        </div>
    );
};

export default Login;