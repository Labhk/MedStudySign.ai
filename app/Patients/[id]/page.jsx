"use client"

export default  function Patients() {
    return(
        <>
        <div className="home-bg">
            <header className="flex justify-between items-center px-4 py-2 rounded-2xl shadow border-gray-200">
            <div className="flex items-center">
                <img
                src="/signature1.gif"
                alt="Signature"
                className="h-13 w-14 mx-auto"
                />
                <div className="text-xl font-bold text-gray-800 tracking-wide ml-2">
                MedStudySign<span className="text-customTeal">.ai</span>
                </div>
            </div>

            </header>
            <div className="min-h-screen">
                Patients consent document
            </div>
        </div>
        </>
    )
}