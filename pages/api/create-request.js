import * as DropboxSign from "@dropbox/sign";

const signatureRequestApi = new DropboxSign.SignatureRequestApi();
const embeddedApi = new DropboxSign.EmbeddedApi();

signatureRequestApi.username = process.env.NEXT_PUBLIC_DROPBOX_API_KEY;
embeddedApi.username = process.env.NEXT_PUBLIC_DROPBOX_API_KEY;

const signingOptions = {
    draw: true,
    type: true,
    upload: true,
    phone: true,
    defaultType: "draw",
};

export default async function handler(req, res) {
    try {
        const { signerEmail } = "labh.k18@gmail.com";
        const { fileUrl } = req.body;
        const { senderEmail } = req.body;
        console.log(signerEmail);
        console.log(typeof(fileUrl));

        const signer = {
            emailAddress: signerEmail,
            name: "Patient",
            order: 0,
        };

        const data = {
            clientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID,
            title: "Consent Document for Patient",
            subject: "Review and Sign the Consent Document",
            message: "Please review and sign the consent document.",
            signers: [signer],
            ccEmailAddresses: [senderEmail, signer.emailAddress],
            file_urls: ["https://firebasestorage.googleapis.com/v0/b/medstudysign.appspot.com/o/consent-forms%2Fclinical-reseach-guide-consent-template.pdf?alt=media&token=3b87a63b-0d4e-4619-be8b-147e769c1b80"],
            signingOptions,
            testMode: true,
        };

        const result = signatureRequestApi.signatureRequestCreateEmbedded(data);
        result.then(async (response) => {
            console.log(response.body);
            console.log(response.body.signatureRequest.signatureRequestId);
            const signatures = response.body.signatureRequest.signatures;
            if (signatures.length > 0) {
                const signatureId = response.body.signatureRequest.signatures[0].signatureId; 
                const embeddedResult = embeddedApi.embeddedSignUrl(signatureId);
                embeddedResult.then((embeddedResponse) => {
                    console.log(embeddedResponse.body);
                    
                    // Send both responses in the HTTP response
                    res.status(200).json({
                        signatureRequestResponse: response.body,
                        embeddedSignUrlResponse: embeddedResponse.body,
                    });
                }).catch((embeddedError) => {
                    console.error("Exception when calling Dropbox Sign API (Embedded Sign URL):");
                    console.error(embeddedError.body);
                    res.status(500).json({ error: "Internal Server Error" });
                });
            } else {
                console.error("No signatures found in the response.");
                res.status(500).json({ error: "Internal Server Error first" });
            }
        }).catch((error) => {
            console.error("Exception when calling Dropbox Sign API (Signature Request):");
            console.error(error.body);
            res.status(500).json({ error: error.body });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: 'Error' });
    }
}
