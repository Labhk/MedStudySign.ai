"use client"

import { FaDropbox } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";

// import HelloSign from 'hellosign-embedded';

export default function Patients({ params }) {
    const { id } = params;
    const [authID, pid] = id.split('--');
    const [study, setStudy] = useState([]);
    const [fileUrl, setFileUrl] = useState("");
    const [signerEmail, setSignerEmail] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [signData, setSignData] = useState(null);
    const [embeddedData, setEmbeddedData] = useState(null);
    const [signUrl, setSignUrl] = useState(null);
    const [activeTab, setActiveTab] = useState('consent');
  
    const handleSignature = () => {
        import("hellosign-embedded").then(({default: HelloSign}) => {
            return new HelloSign({
                allowCancel: false,
                clientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID, 
            })
        }).then(client => {
            client.open(signUrl, {
                testMode: true,
                skipDomainVerification: false,
            })
            client.on('sign', (data) => {
                console.log('The document has been signed!');
                const updatedPatients = study[0].patients.map(patient => {
                    if (patient.pid === pid) {
                        return {
                            ...patient,
                            signatureStatus: 'Signed',
                            signedOn: new Date().toLocaleDateString(),
                            signatureRequestId: signData.signatureRequest.signatureRequestId,
                        };
                    }
                    return patient;
                });
                

                const updatedStudy = { ...study[0], patients: updatedPatients };

                const docRef = doc(db, "researchStudy", authID);
                updateDoc(docRef, updatedStudy)
                
                .catch(error => {
                    console.error("Error updating Firebase document:", error);
                }) 

                router.push(`/Confirmation/${authID}--${pid}`);
            });
        })
    };

    const fetchData = async (uid) => {
        const docRef = doc(db, "researchStudy", uid);
        const docSnap = await getDoc(docRef);
      
        if (docSnap.exists()) {
            const studyData = docSnap.data();
            setStudy([studyData]);
            setFileUrl(studyData.documentUrl); 
            setSenderEmail(studyData.email);
            setLoading(false);
            
            const patient = studyData.patients.find(patient => patient.pid === pid);
            if (patient) {
                setSignerEmail(patient.email); 

                if (patient.signatureStatus === 'Signed') {
                    router.push(`/Confirmation/${authID}--${pid}`);
                }
            }
        } else {
            console.log("No such document yet!");
            setLoading(false); 
        }
    };
      
    useEffect(() => {
        fetchData(authID);
    }, []);

    useEffect(() => {
        
        if (signerEmail && fileUrl) {
            fetch("/api/create-request", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    signerEmail: signerEmail,
                    senderEmail: senderEmail,
                    fileUrl: fileUrl,
                }),
            })
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                setSignData(data.signatureRequestResponse);
                setEmbeddedData(data.embeddedSignUrlResponse);
            
            })
            .catch(error => {
                console.error("An error occurred:", error);
            })
        }
    }, [signerEmail, fileUrl]);
    
    useEffect(() => {
            if (signData && embeddedData) {
                const { signatureRequestId, signatures } = signData.signatureRequest;
                const { signUrl } = embeddedData.embedded;
                setSignUrl(signUrl);
                const updatedPatients = study[0].patients.map(patient => {
                    if (patient.pid === pid) {
                        return {
                            ...patient,
                            signatureRequestId: signatureRequestId,
                            signatureId: signatures[0].signatureId,
                            statusCode: signatures[0].statusCode,
                        };
                    }
                    return patient;
                });
                

                const updatedStudy = { ...study[0], patients: updatedPatients };

                const docRef = doc(db, "researchStudy", authID);
                updateDoc(docRef, updatedStudy)
                .catch(error => {
                    console.error("Error updating Firebase document:", error);
                })                
            }
        }, [signData, embeddedData]);

    const toggleTab = (tabName) => {
        setActiveTab(tabName);
    };


    return (
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
                    <div className="text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-3 flex gap-1" onClick={handleSignature}>
                        <span className="text-2xl mr-1"><FaDropbox/></span> Sign Document 
                    </div>
                    
                </header>
                <div className="min-h-screen  ">
                    <div className='flex mb-3'>
                        <button
                            onClick={() => toggleTab('consent')}
                            className={`w-full py-2 ${activeTab === 'consent' ? ' font-medium py-1 px-3 k cursor-pointer shadow-md border-2 border-transparent bg-customDark text-white ' : 'text-customDark bg-white border-2 border-customDark'}`}
                        >
                            Consent Document
                        </button>
                        <button
                            onClick={() => toggleTab('summary')}
                            className={`w-full py-2 ${activeTab === 'summary' ? ' font-medium py-1 px-3 k cursor-pointer shadow-md border-2 border-transparent bg-customDark text-white ' : 'text-customDark bg-white border-2 border-customDark'}`}
                        >
                            View Summary
                        </button>
                    </div>

                    {activeTab === 'consent' && (
                        <div>
                            {loading ? (
                            <div className="flex flex-col justify-center items-center text-center py-10 text-lg font-medium ">
                                <div className=""><img src="/spin.gif" className="h-14"  alt="x" /></div>
                            </div>
                            ) : (
                                <div className="h-screen">
                                    <embed
                                        type="application/pdf"
                                        src={fileUrl}
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                            
                            )}
                        </div>
                    )}


                    {activeTab === 'summary' && (
                        <div>
                            <h2>View Summary</h2>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
