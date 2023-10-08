import React, { useState } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
import { onAuthStateChanged  } from 'firebase/auth';

export default function StudyForm({ showForm, setShowForm, onSubmit }) {
  const [formData, setFormData] = useState({
    researchTopic: '',
    clinicName: '',
    duration: '',
    cliniciansName: '',
    researchDescription: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthStateChanged(auth, (user) => {
      
      if (user) {
        const uid = user.uid;
        setDoc(doc(db, "researchStudy", uid), {
          topic: formData.researchTopic,
          clinicName: formData.clinicName,
          clinician: formData.cliniciansName,
          ResearchDescription: formData.researchDescription, 
          Duration: formData.duration,
          email: user.email,
        })
          .then(() => {
            console.log("Research created successfully");
            onSubmit();
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      } else {
        console.log("User not signed in");
      }
    });
    
    setFormData({
      researchTopic: '',
      clinicName: '',
      duration: '',
      cliniciansName: '',
      researchDescription: '',
    });

    setShowForm(false);
  };

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 bg-white p-4 w-full md:w-1/3 mx-3  rounded-lg shadow-md">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-0 right-0 mt-1 mr-2 text-lg text-gray-500 hover:text-gray-800"
            >
              &#x2715;
            </button>
            <div className="text-xl text-center font-semibold mb-6 mt-3">Research Study Form</div>
            <form onSubmit={handleSubmit} className="text-sm mx-6">
              <div className="mb-4">
                <label className="block font-medium">Research Topic:</label>
                <input
                  type="text"
                  name="researchTopic"
                  value={formData.researchTopic}
                  onChange={handleInputChange}
                  className="w-full border rounded py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Clinic Name:</label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                  className="w-full border rounded py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Duration:</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border rounded py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Clinician's Name:</label>
                <input
                  type="text"
                  name="cliniciansName"
                  value={formData.cliniciansName}
                  onChange={handleInputChange}
                  className="w-full border rounded py-2 px-3"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium">Research Description:</label>
                <textarea
                  name="researchDescription"
                  value={formData.researchDescription}
                  onChange={handleInputChange}
                  className="w-full border rounded py-2 px-3"
                ></textarea>
              </div>
              <div className="text-center mb-3">
                <button
                  type="submit"
                  className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
