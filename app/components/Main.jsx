import ResearchStudy from "./ResearchStudy";
import StudyForm from "./StudyForm";
import React, { useEffect, useState } from 'react';
import {HiDocumentText} from 'react-icons/hi2';
import {GrDocumentPdf} from 'react-icons/gr';
import {BsFillPeopleFill} from 'react-icons/bs';
import {BiSolidSend} from 'react-icons/bi';
import {BsPersonFillAdd} from 'react-icons/bs';
import {MdAddCircle} from 'react-icons/md';
import UploadDoc from "./UploadDoc";
import { doc, getDoc   } from "firebase/firestore";
import { db } from '../../firebase/config';
import PDFViewer from "./PDFViewer";

export default function Main() {
  const [showForm, setShowForm] = useState(false);
  const [studyDataChanged, setStudyDataChanged] = useState(false);
  const [isDocUploaded, setIsDocUploaded] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const openPDFViewer = () => {
    setShowPDFViewer(true);
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
  };

  const handleFormSubmit = () => {
    setStudyDataChanged((prev) => !prev);
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
        console.log("Document data:", studySnap.data().clinicName);
        console.log("Document data:", studySnap.data().documentUrl);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
  
    getStudyData();
  }, []);
  

  return (
    
    <>
    <div className="flex w-full px-5 mt-5  ">
      <div className="w-2/5">
        <div className="flex flex-col">
            <div className="flex justify-between items-end py-2">
            <div className="text-2xl font-semibold ml-3 flex gap-1 justify-center items-center"><HiDocumentText /><span className="mt-1 text-lg">Research Study</span></div>
            <div className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal  hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3 flex gap-1" onClick={() => {setShowForm(true)}}><MdAddCircle/>New Study </div>
            </div>
            
            <div className="h-full w-full  shadow-div rounded-xl bg ">
                <ResearchStudy studyDataChanged={studyDataChanged}/>
            </div>
        </div>
        <div className="mt-5 ">
        <div className="flex justify-between items-end py-2">
            <div className="text-2xl font-bold ml-3 flex gap-2 items-center"><GrDocumentPdf /><span className="mt-1 text-lg">Upload Document</span></div>
            <div className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal  hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3 flex gap-1">Send <BiSolidSend/></div>
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

      <div className="w-3/5 pl-5">
      <div className="flex justify-between items-end py-2">
            <div className="text-2xl font-semibold ml-3 flex gap-2 items-center"><BsFillPeopleFill /><span className="mt-1 text-lg mb-1">Patients</span></div>
            <div className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal  hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3 flex gap-1"><BsPersonFillAdd/> New Patient </div>
            </div>
            
            <div className="h-[85vh] w-full shadow-div rounded-xl bg">
                Table
            </div>
      </div>
    </div>
    <div className="">
    <StudyForm showForm={showForm} setShowForm={setShowForm} onSubmit={handleFormSubmit}  />
    </div>
    {showPDFViewer && (
        <PDFViewer downloadURL={downloadURL} onClose={() => closePDFViewer()} />
      )}
    </>
  );
}
