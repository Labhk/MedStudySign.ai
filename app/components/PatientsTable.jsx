import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function PatientsTable({ patientDataChanged }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs

  const fetchPost = async (uid) => {
    const docRef = doc(db, "researchStudy", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const patientsData = docSnap.data();
      setPatients(patientsData.patients);
      setLoading(false);
    } else {
      console.log("No such document yet!");
      setLoading(false);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        fetchPost(uid);
      } else {
        console.log("User not signed in");
        setLoading(true);
      }
    });
  }, [patientDataChanged, selectedRows]);

  const toggleRowSelection = (rowId) => {
    // Toggle the selected state of a row
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const isRowSelected = (rowId) => {
    // Check if a row is selected
    return selectedRows.includes(rowId);
  };

  const selectAllRows = () => {
    // Select all rows
    const allRowIds = patients.map((patient, index) => index);
    setSelectedRows(allRowIds);
  };

  const clearSelectedRows = () => {
    // Clear all selected rows
    setSelectedRows([]);
  };

  const getStatusButtonStyle = (status) => {
    switch (status) {
      case 'Sent':
        return 'border-[1.5px] border-customDark text-customDark bg-white rounded-full';
      case 'Signed':
        return 'border-[1.5px] border-customDark bg-customDark text-white rounded-full';
      case 'Not sent':
        return 'border-[1.5px] border-gray-300 text-gray-400 bg-white rounded-full';
      default:
        return 'bg-gray-300 rounded-full';
    }
  };

  const handleSendSignatureDoc = async () => {
    try {

      const selectedPatients = selectedRows.map((rowIndex) => patients[rowIndex]);

      const requestData = {
        patients: selectedPatients,
        authID: localStorage.getItem('authID'),
      };
      console.log(requestData);

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        console.log('Send Signature Document request successful');
      } else {
        // Handle errors
        console.error('Send Signature Document request failed');
      }
    } catch (error) {
      console.error('Error sending signature document:', error);
    }
  };

  console.log(selectedRows);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full relative">
        {loading ? (
            <div className="flex justify-center items-center text-center text-lg font-medium h-full w-full"> {/* Centered loading spinner */}
            <div className="p-20"><img src="/spin.gif" className="h-14" alt="x" /></div>
          </div>
        ) : patients && patients.length > 0 ? (
          <>
          <div className="w-full h-full ">
            <div className="">
            <table className="w-full  rounded-xl">
            <thead>
              <tr className="bg-gray-950 text-white">
                <th className="py-3 px-4 rounded-tl-xl border-r border-b text-sm border-gray-300"></th>
                <th className="py-3 px-4 border text-base border-gray-300 w-1/2">Email</th>
                <th className="py-3 px-4 border text-base border-gray-300">Signed On</th>
                <th className="rounded-tr-xl py-3 px-4 border-l border-b text-base border-gray-300">Signature Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg' : 'bg'}>
                  <td className="px-4 border text-center">
                    <div className="flex items-center justify-center">
                    <input
                      type="radio"
                      className="h-[0.8rem] w-[0.8rem] text-black  focus:ring-0 "
                      checked={isRowSelected(index)}
                      onChange={() => toggleRowSelection(index)}
                    />
                    </div>
                    
                  </td>
                  <td className="py-2 px-4 border text-base border-gray-300">{patient.email}</td>
                  <td className="py-2 px-4 border text-base border-gray-300 text-center">{patient.currentDate}</td>
                  
                  <td className='rounded-br-sm py-2 px-4 border text-[0.8rem] text-center '>
                    <button className={`w-fit rounded-full py-2 px-3 font-semibold ${getStatusButtonStyle(patient.signatureStatus)}`} >{patient.signatureStatus}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          
            <div className="text-sm absolute bottom-0 rounded-xl w-full p-2 flex justify-between">
            <div className="">
              <button className="rounded-lg text-sm font-medium py-1 px-3 hover:border-2 hover:border-customDark cursor-pointer shadow-md border-2 border-transparent bg-customDark text-white hover:text-customDark hover:bg-white  mr-1" onClick={selectAllRows}>Select All</button>
              <button className="rounded-lg text-sm font-medium py-1 px-3 hover:border-2  cursor-pointer shadow-md border-2 border-customDark bg-white text-customDark hover:border-gray-900 hover:bg-gray-900 hover:text-white " onClick={clearSelectedRows}>X</button>
            </div>
            <div className="">
              <button className="rounded-lg text-sm font-medium py-1 px-3 hover:border-2 hover:border-customDark cursor-pointer shadow-md border-2 border-transparent bg-customDark text-white hover:text-customDark hover:bg-white  mr-2">Cancel Request</button>
              <button className="rounded-lg text-sm font-medium py-1 px-3 hover:border-2 hover:border-customDark cursor-pointer shadow-md border-2 border-transparent bg-customDark text-white hover:text-customDark hover:bg-white  mr-2">Send Reminder</button>
              <button className="rounded-lg text-sm font-medium py-1 px-3 hover:border-2 hover:border-customDark cursor-pointer shadow-md border-2 border-transparent bg-customDark text-white hover:text-customDark hover:bg-white mr-1" onClick={handleSendSignatureDoc}>Send for Signature</button>
            </div>
          </div>



          </div>
          
          </>
        ) : (
          <div className="flex flex-col justify-center items-center text-center text-lg font-medium h-full w-full p-32">
          <div className=""><img src="https://i.ibb.co/0hW3gXS/forbidden.png" className="h-28 " alt="x" /></div>
          <div className="mt-3 text-gray-800 text-2xl">No Patients Added</div>
        </div>
        )}
      </div>
    </div>
  );
}


