"use client"

import { FaDropbox } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import axios from 'axios';

// import HelloSign from 'hellosign-embedded';

export default function Patients({ params }) {
    const { id } = params;
    const [authID, pid] = id.split('--');
    const [study, setStudy] = useState([]);
    const [fileUrl, setFileUrl] = useState(null);
    const [signerEmail, setSignerEmail] = useState(null);
    const [senderEmail, setSenderEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [signData, setSignData] = useState(null);
    const [embeddedData, setEmbeddedData] = useState(null);
    const [signUrl, setSignUrl] = useState(null);
    const [activeTab, setActiveTab] = useState('consent');
    const [summary, setSummary] = useState(null);
  
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
                            signatureRequestId: signData.signature_request.signature_request_id,
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
            createSummaryArray(studyData.summary)
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
            const apiKey = process.env.NEXT_PUBLIC_DROPBOX_API_KEY;
    
            const requestBody = {
                client_id: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID,
                file_urls: [fileUrl],
                title: 'Consent Document for Patient',
                subject: 'Review and Sign the Consent Document',
                message: 'Please review and sign the consent document.',
                signers: [
                    {
                        email_address: signerEmail,
                        name: 'Patient',
                        order: 0,
                    },
                ],
                cc_email_addresses: [senderEmail],
                signing_options: {
                    draw: true,
                    type: true,
                    upload: true,
                    phone: true,
                    default_type: 'draw',
                },
                test_mode: 1,
            };
    
            axios({
                method: 'post',
                url: 'https://api.hellosign.com/v3/signature_request/create_embedded',
                auth: {
                    username: apiKey,
                    password: '',
                },
                data: requestBody,
            })
                .then(response => {
                    console.log('Success:', response.data);
                    setSignData(response.data);
                    console.log('Signature Request ID:', response.data.signature_request.signature_request_id)
    
                    const signatureId = response.data.signature_request.signatures[0].signature_id;
    
                    axios({
                        method: 'get',
                        url: `https://api.hellosign.com/v3/embedded/sign_url/${signatureId}`,
                        auth: {
                            username: apiKey,
                            password: '',
                        },
                    })
                        .then(embeddedResponse => {
                            console.log('Embedded Sign URL:', embeddedResponse.data);
                            setEmbeddedData(embeddedResponse.data);
                            
                        })
                        .catch(embeddedError => {
                            console.error('An error occurred while fetching the embedded sign URL:', embeddedError);
                        });
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                });
        }
    }, [signerEmail, fileUrl]);
    
    const createSummaryArray = (summary) => {
        const summary1 = summary.replaceAll('Dr.', 'Dr');
        const summaryArray = summary1.split('.');
        setSummary(summaryArray); 
    }

    useEffect(() => {
            if (signData && embeddedData) {
                console.log('Sign Data1:', signData);
                console.log('Embedded Data1:', embeddedData);
                const { signature_request_id, signatures } = signData.signature_request;
                const { sign_url } = embeddedData.embedded;
                setSignUrl(sign_url);
                const updatedPatients = study[0].patients.map(patient => {
                    if (patient.pid === pid) {
                        return {
                            ...patient,
                            signatureRequestId: signature_request_id,
                        };
                    }
                    return patient;
                });
                
                console.log("Auth ID", authID);
                console.log("Updated Patients", updatedPatients);
                console.log("Study", study[0]);
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
                <header className="flex justify-between items-center px-2 md:px-4 py-2 rounded-2xl shadow border-gray-200">
                    <div className="flex items-center">
                        <img
                            src="/signature1.gif"
                            alt="Signature"
                            className="h-11 w-10 md:h-14 md:w-14 mx-auto"
                        />
                        <div className="text-sm md:text-xl font-bold text-gray-800 tracking-wide ml-1 md:ml-2">
                            MedStudySign<span className="text-customTeal">.ai</span>
                        </div>
                    </div>
                    <div className="text-[0.78rem] md:text-[1rem] rounded-lg px-4 py-2 hover:shadow-none hover:bg-white hover:border hover:border-customTeal hover:text-customTeal cursor-pointer shadow-button bg-customDark text-white font-semibold mr-0 md:mr-3 flex gap-1" onClick={handleSignature}>
                        <span className="text-xl md:text-2xl mr-1"><FaDropbox/></span> Sign Document 
                    </div>
                    
                </header>
                <div className="min-h-screen  ">
                    <div className='flex mb-3 mt-4 md:mt-0'>
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
                            {loading ? (
                            <div className="flex flex-col justify-center items-center text-center py-10 text-lg font-medium ">
                                <div className=""><img src="/spin.gif" className="h-14"  alt="x" /></div>
                            </div>
                            ) : (
                                <ul className="list-outside list-square rounded-xl mx-3 my-2  md:mx-4 md:my-4 border-2 border-customDark bg-white md:px-44 px-10 py-4 md:py-8 text-justify text-sm md:text-xl text-customDark">
                                {summary.slice(0, -1).map((item, index) => (
                                    <li key={index} className="mb-2 md:mb-4 text-black">{item}.</li>
                                ))}
                                </ul>


                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
