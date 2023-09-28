import ResearchStudy from "./ResearchStudy";
import StudyForm from "./StudyForm";
import React, { useEffect, useState } from 'react';
import {HiDocumentText} from 'react-icons/hi2';
import {GrDocumentPdf} from 'react-icons/gr';
import {BsFillPeopleFill} from 'react-icons/bs';
import {TfiReload} from 'react-icons/tfi';
import {BsPersonFillAdd} from 'react-icons/bs';
import {MdAddCircle} from 'react-icons/md';
import UploadDoc from "./UploadDoc";
import { doc, getDoc   } from "firebase/firestore";
import { db } from '../../firebase/config';
import PDFViewer from "./PDFViewer";
import NewPatient from "./NewPatient";
import PatientsTable from "./PatientsTable";

export default function Main() {
  const [showStudyForm, setShowStudyForm] = useState(false); 
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [studyDataChanged, setStudyDataChanged] = useState(false);
  const [patientDataChanged, setPatientDataChanged] = useState(false);
  const [isDocUploaded, setIsDocUploaded] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [isRotated, setIsRotated] = useState(false);

  const handleRotation = () => {
    setIsRotated(true);
    setPatientDataChanged((prev) => !prev);

    setTimeout(() => {
      setIsRotated(false);
    }, 800); 
  };

  const openPDFViewer = () => {
    setShowPDFViewer(true);
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
  };

  const handleFormSubmit = () => {
    setStudyDataChanged((prev) => !prev);
  };

  const handlePatientSubmit = () => {
    setPatientDataChanged((prev) => !prev);
  };


  useEffect(() => {
    const getStudyData = async () => {
      const uid = localStorage.getItem("authID");
      const studyRef = doc(db, "researchStudy", uid);
      const studySnap = await getDoc(studyRef);
  
      if (studySnap.exists()) {
        const downloadUrl = studySnap.data().documentUrl;
        if (downloadUrl) {
          setIsDocUploaded(true);
          setDownloadURL(downloadUrl);
        }
        
      } else {
        console.log("No such document!");
      }
    };
  
    getStudyData();
  }, []);
  

  return (
    
    <>
    <div className="flex md:flex-row flex-col w-full px-5 mt-5  ">
      <div className="md:w-2/5">
        <div className="flex flex-col">
            <div className="flex justify-between items-end py-2">
            <div className="md:text-2xl text-lg font-semibold ml-3 flex gap-1 justify-center items-center"><HiDocumentText /><span className="mt-1 text-[0.85rem] md:text-lg">Research Study</span></div>
            <div className="text-[0.75rem] md:text-[1rem] rounded-lg px-3 md:px-4 py-2 md:py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3 flex gap-1" onClick={() => {setShowStudyForm(true)}}><MdAddCircle/>New Study </div>
            </div>
            
            <div className="h-full w-full  shadow-div rounded-xl bg ">
                <ResearchStudy studyDataChanged={studyDataChanged}/>
            </div>
        </div>
        <div className="mt-5 ">
        <div className="flex justify-between items-end py-2">
            <div className="md:text-2xl text-lg font-bold ml-3 flex gap-2 items-center"><GrDocumentPdf /><span className="mt-1 text-[0.85rem] md:text-lg">Upload Document</span></div>
            </div>
            
            <div className="h-full w-full shadow-div mb-3 rounded-xl bg">
                {isDocUploaded ? (
                  <><div className="py-10 flex flex-col justify-center items-center">
                    <div className="text-xl mb-2">Doc Successfully Uploaded!!</div>
                    <button
                      className="text-base py-1 px-3 ml-2 cursor-pointer shadow-md border-2 border-customDark bg-customDark text-white hover:border-gray-900 hover:bg-gray-900 hover:text-white rounded-xl"
                      onClick={() => openPDFViewer()}
                    >
                      View
                    </button>
                  </div></>
                ) : (
                  <UploadDoc/>
                )}
                
            </div>
        </div>
      </div>

      <div className="md:w-3/5 mt-6 md:mt-0 md:pl-5 md:mb-0 mb-10">
      <div className="flex justify-between items-end py-2">
            <div className="md:text-2xl text-lg font-semibold ml-3 flex gap-2 items-center"><BsFillPeopleFill /><span className="mt-1 text-[0.85rem] md:text-lg mb-1">Patients</span></div>
            <div className="flex items-center justify-center gap-4">
              <div className="md:text-2xl text-lg font-bold">
                <TfiReload className={`cursor-pointer ${isRotated ? 'rotate-360 active' : ''}`}onClick={handleRotation}/> 
              </div>
              <div className="text-[0.75rem] md:text-[1rem] rounded-lg px-3 md:px-4  py-2 md:py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3 flex gap-1" onClick={() => {setShowPatientForm(true)}}><BsPersonFillAdd/> New Patient </div>
            
              </div>
        </div>
            
            
            <div className="h-[55vh] md:h-[81vh] w-full shadow-div rounded-xl bg ">
                <PatientsTable patientDataChanged={patientDataChanged} setPatientDataChanged={setPatientDataChanged}/>
            </div>
      </div>
    </div>
    <div className="">
    <StudyForm showForm={showStudyForm} setShowForm={setShowStudyForm} onSubmit={handleFormSubmit}  />

    </div>
    <div className="">
    <NewPatient showForm={showPatientForm} setShowForm={setShowPatientForm} onSubmit={handlePatientSubmit}/>
    </div>
    {showPDFViewer && (
        <PDFViewer downloadURL={downloadURL} onClose={() => closePDFViewer()} />
      )}
    </>
  );
}
