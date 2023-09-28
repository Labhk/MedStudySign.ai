import { useEffect, useState } from 'react';
import { auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {BiLogOut} from 'react-icons/bi'

export default function Header({ setLoggedIn }) {
    const [user, setUser] = useState(null);
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
            setUser(authUser);
        } else {
            setUser(null);
        }
        });
    }, []);

    const handleSignOut = () => {
        try {
            auth.signOut()
            setUser(null);
            setShowLogout(false);
            setLoggedIn(false);
            localStorage.removeItem('email')
            localStorage.removeItem('authID')
            localStorage.setItem('status',"Logged Out")
        } catch (error) {
        console.error('Sign-out error:', error);
        }
    };

    return (
        <header className="flex justify-between items-center px-2 md:px-4 py-2 rounded-2xl shadow border-gray-200">
        <div className="flex items-center">
            <img
            src="/signature1.gif"
            alt="Signature"
            className="h-11 w-10 md:h-14 md:w-14 mx-auto"
            />
            <div className="text-sm md:text-xl font-bold text-gray-800 tracking-wide ml-1 md:ml-2">
            MedStudySign<span className="text-customTeal">.ai</span>
            </div>
        </div>

        {user ? (
            <div
            className="flex items-center relative hover:bg-white rounded-md p-2"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
            >
            <img
                src={user.photoURL}
                alt="User Profile"
                className="w-9 h-9 rounded-full cursor-pointer"
            />
            <div className={`absolute left-0 right-0 top-14 bg-white ${showLogout ? 'block' : 'hidden'}`}>
                <button
                onClick={handleSignOut}
                className="w-full bg-customTeal font-medium text-white px-4 py-1 rounded-md hover:bg-white hover:border hover:border-customTeal  hover:text-customTeal"
                >
                    <div className="md:block hidden">Logout</div>
                <div className="md:hidden block my-2"><BiLogOut/></div>
                
                </button>
            </div>
            <div className="ml-2 cursor-pointer text-sm hidden md:block">
                <p>{user.displayName}</p>
                <p>{user.email}</p>
            </div>
            </div>
        ) : null}
        </header>
    );
}
