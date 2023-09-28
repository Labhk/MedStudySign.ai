import React from 'react';
import {IoCheckmarkDoneCircleSharp} from 'react-icons/io5';

export default function Confirmation() {
    return (
        <>
            <div className="home-bg h-screen">
                <header className="flex justify-between items-center px-4 py-2 rounded-2xl shadow border-gray-200">
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
                </header>

                <div className="flex flex-col items-center justify-center mt-24 px-10 md:px-0 ">
                        <div className="text-[5rem] md:text-[9rem] text-black">
                        <IoCheckmarkDoneCircleSharp/>
                        </div>
                    <h1 className="text-2xl md:text-4xl text-center font-bold text-black mb-4">
                        Your Document is Successfully Signed
                    </h1>
                    
                    <p className="text-base md:text-lg text-gray-700 text-center md:w-2/3">
                    We would like to express our gratitude for your willingness to participate in our research study. <br/>Your contribution is invaluable.
                    </p>
                </div>
            </div>
        </>
    )
}
