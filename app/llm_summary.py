import os
import openai
import requests
from PyPDF2 import PdfReader


openai.api_key = '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'

def extract_text_from_pdf(pdf_path):
    # creating a pdf reader object
    reader = PdfReader(pdf_path)
    text = ''
    for page in reader.pages:
        text_page = page.extract_text()
        text = text + text_page
    return text

def call_openai(prompt):
    response = openai.Completion.create(
        model="gpt-3.5-turbo-0301",
        # prompt=prompt,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        n=1,
        temperature=0.5,
    )
    print(response)
    output_text = response.choices[0].text
    return output_text

def get_study_summary_text(pdf_path):
    try:

        extracted_text = extract_text_from_pdf(pdf_path)
        prompt = f"Please summarize this document in one paragraph. \n {extracted_text}"
        summary_text = call_openai(prompt)
        return summary_text
    except Exception as e:
        print("Error extracting text from the PDF:", str(e))
        return ''

if __name__ == '__main__':
    pdf_path = 'clinical-reseach-guide-consent-template.pdf'  # Provide a suitable path to save the PDF file
    summary_text = get_study_summary_text(pdf_path)
    print(summary_text)
