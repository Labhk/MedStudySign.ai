import { useEffect, useState } from 'react';
import { auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

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
            localStorage.setItem('status',"Logged Out")
        } catch (error) {
        console.error('Sign-out error:', error);
        }
    };

    return (
        <header className="flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
            <img
            src="/signature1.gif"
            alt="Signature"
            className="h-15 w-16 mx-auto"
            />
            <div className="text-2xl font-extrabold text-gray-800 tracking-wide ml-4">
            MedStudySign<span className="text-customTeal">.ai</span>
            </div>
        </div>

        {user ? (
            <div
            className="flex items-center relative hover:bg-slate-100 rounded-md p-2"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
            >
            <img
                src={user.photoURL}
                alt="User Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
            />
            <div className={`absolute left-0 right-0 top-16 bg-white ${showLogout ? 'block' : 'hidden'}`}>
                <button
                onClick={handleSignOut}
                className="w-full bg-customTeal font-medium text-white px-4 py-1 rounded-md hover:bg-white hover:border hover:border-customTeal  hover:text-customTeal"
                >
                Logout
                </button>
            </div>
            <div className="ml-2 cursor-pointer">
                <p>{user.displayName}</p>
                <p>{user.email}</p>
            </div>
            </div>
        ) : null}
        </header>
    );
}
