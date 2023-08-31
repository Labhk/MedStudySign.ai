# MedStudySign.ai

In order for patients to enroll in a study, they must sign a consent form ([source](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3601699/#:~:text=For%20a%20valid%20consent%2C%20information,benefits%20associated%20with%20research%20participation)). The plan is for clinicians to upload a patient consent document, and we use the Dropbox API to get that document signed by a patient. We also utilize a Language Model (LLM) to summarize the document.

**User Story:**
- Clinician signs into the website and starts a research study.
- Clinician can upload a document for the patient to sign.
- Clinician enters the email address(es) of the patient(s).
- Dropbox API is used for patient signatures.
- Language Model (LLM) is used to summarize the consent form for the patient.
- The patient signs the document, and the clinician is notified.
