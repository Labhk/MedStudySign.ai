import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function NewPatient({ showForm, setShowForm, onSubmit}) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const currentDate = new Date().toLocaleDateString();
        const signatureStatus = 'Not sent';

        const newPatient = {
          email: email,
          currentDate: currentDate,
          signatureStatus: signatureStatus,
        };

        updateDoc(doc(db, 'researchStudy', uid), {
          patients: arrayUnion(newPatient),
        })
          .then(() => {
            console.log('Patient data successfully added');
            onSubmit();
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
          });
      } else {
        console.log('User not signed in');
      }
    });

    setEmail('');
    setShowForm(false);
  };

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 bg-white p-4 w-1/3  rounded-lg shadow-md">
            <button
                onClick={() => setShowForm(false)}
                className="absolute top-0 right-0 mt-1 mr-2 text-lg text-gray-500 hover:text-gray-800"
              >
              &#x2715;
            </button>
            <div className="text-xl text-center font-semibold mb-6 mt-3">Add New Patient</div>
            <form onSubmit={handleSubmit} className="text-sm mx-6">
              <div className="mb-4">
                <label className="block font-medium">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded py-2 px-3"
                />
              </div>

              <div className="text-center mb-3">
                <button
                  type="submit"
                  className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
