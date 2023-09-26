import { useState, useRef } from "react";
import { storage } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import PDFViewer from "./PDFViewer";
import { doc, updateDoc  } from "firebase/firestore";
import { db } from '../../firebase/config';

export default function UploadDoc() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  const openPDFViewer = () => {
    setShowPDFViewer(true);
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
  };

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setDragOver(false);
    } else {
      alert("Please select a PDF file.");
      event.target.value = null;
    }
  };

  const handleSelectFile = () => {
    inputRef.current.click();
  };

  const uploadDoc = () => {
    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const storageRef = ref(storage, `/consent-forms/${file.name}`);

    setIsUploading(true); // Set isUploading to true when starting the upload

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track the upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false); // Set isUploading to false on error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setUploadComplete(true);
            setDownloadURL(url);
            setIsUploading(false);
            const uid = localStorage.getItem("authID");
            const uploadDocRef = doc(db, "researchStudy", uid);
            updateDoc(uploadDocRef, {
              documentUrl: url
            });

          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setIsUploading(false); // Set isUploading to false on error
          });
      }
    );
  };

  const handleCancel = () => {
    setFile(null);
    setUploadComplete(false); // Reset uploadComplete when canceling
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Please drop a PDF file.");
    }
  };

  return (
    <>
      {uploadComplete ? (
        <>
        <div className="py-10 flex flex-col justify-center items-center">
        <div className="text-lg font-medium">
          <span className="text-gray-800  text-base underline">{file.name}</span>  
          </div>
          <div className="text-xl mb-2">Successfully Uploaded!!</div>
          <button
            className="text-base py-1 px-3 ml-2 cursor-pointer shadow-md border-2 border-customDark bg-customDark text-white hover:border-gray-900 hover:bg-gray-900 hover:text-white rounded-xl"
            onClick={() => openPDFViewer()}
          >
            View
          </button>
        </div>
        </>
        
        
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`py-10 flex flex-col justify-center items-center  border-dashed border-gray-300 hover:border-customDark border-4 rounded-xl font-medium text-gray-400 ${
            dragOver ? "bg-customDark opacity-8 border-none" : ""
          }`}
        >
          {!file && (
            <div className="flex flex-col items-center">
              <div className="text-xl mb-2">
                {dragOver ? <span className="text-white">Drop Here</span> : "Drag & Drop PDF File"}
              </div>
              <div className="text-base font-normal mb-2">OR</div>
              <input
                type="file"
                onChange={handleChange}
                hidden
                accept=".pdf"
                ref={inputRef}
              />
              <button
                className="text-base py-1 px-3 hover:border-2 cursor-pointer shadow-md border-none bg-customDark text-white hover:border-customDark hover:text-customDark hover:bg-white rounded-xl"
                onClick={handleSelectFile}
              >
                Select PDF File
              </button>
            </div>
          )}
          {file && (
            <div className="flex flex-col px-6 items-center">
              <div className="text-lg mb-2 flex justify-center gap-2 text-center">
                File Selected:{" "}
                <span className="text-gray-800 underline text-base">
                  {file.name}
                </span>
              </div>
              <div className="flex">
              <button
                className="text-base py-1 px-3 cursor-pointer shadow-md border-none rounded-xl mr-2 border-2 border-customDark bg-customDark text-white hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                onClick={uploadDoc}
                disabled={isUploading} 
              >
                  {isUploading ? "Uploading..." : "Upload"} 
              </button>
                <button
                  className="text-base py-1 px-3 hover:border-2 cursor-pointer shadow-md border-2 border-customDark bg-white text-customDark hover:border-gray-900 hover:bg-gray-900 hover:text-white  rounded-xl"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showPDFViewer && (
        <PDFViewer downloadURL={downloadURL} onClose={() => closePDFViewer()} />
      )}
    </>
  );
}
