# MedStudySign.ai

In order for a patients to enroll in a study, they must sign a consent form (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3601699/#:~:text=For%20a%20valid%20consent%2C%20information,benefits%20associated%20with%20research%20participation). The plan would be for clinicians to upload a patient consent document and we use the dropbox api to get that document signed by a patient.  We also use an LLM  to summarize the document

User story:
Clinician signs into the website and starts a research study
Clinician will be able to upload a document the patient will sign
Clinician will enter email address(es) of patient(s)
Dropbox API used for patient signiture
LLM used to summarize the consent form for the patient
Patient signs document and Clinician is notified
