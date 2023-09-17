import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function PatientsTable({ patientDataChanged }) {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPost = async (uid) => {
    const docRef = doc(db, "researchStudy", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const patientsData = docSnap.data();
      setPatients(patientsData.patients);
      console.log(patientsData.patients,"  type  " ,typeof(patientsData.patients));
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
  }, [patientDataChanged]);

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

  return (
    <div className="w-full">
      <div className="flex justify-center items-center h-full"> {/* Apply flexbox styles */}
        {loading ? (
          <div className="flex justify-center items-center text-center text-lg font-medium h-full w-full"> {/* Centered loading spinner */}
            <div className="p-20"><img src="/spin.gif" className="h-14" alt="x" /></div>
          </div>
        ) : patients && patients.length > 0 ? (
          <table className="w-full rounded-xl">
            <thead>
              <tr className="bg-gray-950 text-white">
                <th className="rounded-tl-xl py-3 px-4 border-r border-b text-base border-gray-300">#</th>
                <th className="py-3 px-4 border text-base border-gray-300 w-1/2">Email</th>
                <th className="py-3 px-4 border text-base border-gray-300">Added On</th>
                <th className="rounded-tr-xl py-3 px-4 border-l border-b text-base border-gray-300">Signature Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg' : 'bg'}>
                  <td className="rounded-bl-sm py-2 px-4 border text-base border-gray-300 text-center">{index + 1}</td>
                  <td className="py-2 px-4 border text-base border-gray-300">{patient.email}</td>
                  <td className="py-2 px-4 border text-base border-gray-300 text-center">{patient.currentDate}</td>
                  <td className='rounded-br-sm py-2 px-4 border text-[0.8rem] text-center '>
                    <button className={`w-fit rounded-full py-2 px-3 font-semibold ${getStatusButtonStyle(patient.signatureStatus)}`} >{patient.signatureStatus}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col justify-center items-center text-center text-lg font-medium h-full w-full p-16">
            <div className=""><img src="https://i.ibb.co/0hW3gXS/forbidden.png" className="h-16 " alt="x" /></div>
            <div className="mt-3 text-gray-800">No Patients Added</div>
          </div>
        )}
      </div>
    </div>
  );
}
