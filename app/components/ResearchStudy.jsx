import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";

export default function ResearchStudy({studyDataChanged}) {
  const [study, setStudy] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPost = async (uid) => {
    const docRef = doc(db, "researchStudy", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const studyData = docSnap.data();
      setStudy([studyData]);
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
  }, [studyDataChanged]);

  return (
    <div className="flex flex-col px-6 py-4">
      {loading ? (
        <div className="flex flex-col justify-center items-center text-center py-10 text-lg font-medium ">
          <div className=""><img src="https://i.ibb.co/0hW3gXS/forbidden.png" className="h-20" alt="x" /></div>
          <div className="mt-3 text-gray-800">Loading...</div>
        </div>
      ) : (
        study.length > 0 ? ( // Ensure study data exists before rendering
          <>
            <div className="text-base font-semibold tracking-wide mb-2">{study[0].topic}</div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">{study[0].clinicName}</div>
              <div className="text-sm text-gray-800">{`Duration: ${study[0].Duration} months`}</div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">{study[0].clinician}</div>
              <div className="text-sm text-gray-500"></div>
            </div>
            <div className="text-xs text-justify">
              {study[0].ResearchDescription}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center text-center py-10 text-lg font-medium ">
            <div className=""><img src="https://i.ibb.co/0hW3gXS/forbidden.png" className="h-20" alt="x" /></div>
            <div className="mt-3 text-gray-800">No Study Created</div>
          </div>
        )
      )}
    </div>
  );
}
