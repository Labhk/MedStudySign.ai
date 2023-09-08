"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth, provider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';
import Header from './components/Header';
import Main from './components/Main';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);


  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      localStorage.setItem('status', 'Logged In');
      localStorage.setItem('email', user.email);

      setLoggedIn(true);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <>
      {loggedIn ? (
        // Render this when the user is logged in
        <div className="home-bg">
          <Header setLoggedIn={setLoggedIn} />
          <div className="h-screen flex items-center justify-center text-5xl">
            <Main/>
          </div>
        </div>
      ) : (
        // Render this when the user is not logged in
        <main className="flex flex-col items-center justify-center h-screen gradient-bg">
          <div className="flex  items-center justify-center">
            <img src="/signature1.gif" alt="Signature" className="h-40 w-44 mx-auto" />
            <div className='text-6xl font-extrabold text-gray-800 tracking-wide'>
              MedStudySign<span className='text-customTeal'>.ai</span>
            </div>
          </div>
          <div className="">
            <p className="text-lg mt-4 text-gray-600 font-light text-center px-48 leading-8">
              Simplify the Enrollment Process for Medical Studies. Join us in advancing healthcare research. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra arcu sit amet leo scelerisque, vel auctor arcu tempus.
            </p>
          </div>
          <div className="">
            <motion.button 
              className="mt-6 pr-4 py-[2px] pb-[5px] flex items-center bg-customTeal text-md font-semibold tracking-wide text-white rounded-sm shadow-button "
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
            >
              <div className="bg-white px-1 mr-3 ml-[2px] py-1 rounded-sm">
                <img src="/search.png" alt="Google" className="h-8 w-8 p-1" />
              </div>
              Sign In with Google
            </motion.button>
          </div>
        </main>
      )}
    </>
  );
}
