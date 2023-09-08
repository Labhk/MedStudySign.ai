import ResearchStudy from "./ResearchStudy";
import StudyForm from "./StudyForm";
import React, { useState } from 'react';

export default function Main() {
  const [showForm, setShowForm] = useState(false);

  return (
    
    <>
    <div className="flex w-full px-5 py-10 mt-10">
      <div className="w-2/5">
        <div className="flex flex-col">
            <div className="flex justify-between items-end py-2">
            <div className="text-lg font-semibold ml-3">Research Study</div>
            <div className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal  hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3" onClick={() => {setShowForm(true)}}>
              New Study
            </div>
            </div>
            
            <div className="h-full w-full  shadow-div rounded-xl bg">
                <ResearchStudy/>
            </div>
        </div>
        <div className="h-1/2 mt-3">
            <div className="text-lg font-semibold">Upload Consent Document</div>
            <div className="h-full w-full  shadow-div rounded-xl bg">

            </div>
        </div>
      </div>

      <div className="w-3/5 h-screen pl-5">
      <div className="flex justify-between items-end py-2">
            <div className="text-lg font-semibold ml-3">Patients</div>
            <div className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal  hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3">New Patient</div>
            </div>
            
            <div className="h-full w-full shadow-div rounded-xl bg">

            </div>
      </div>
    </div>
    <div className="">
        <StudyForm showForm={showForm} setShowForm={setShowForm}/>
    </div>
    </>
  );
}
