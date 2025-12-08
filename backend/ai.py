import openai
import os
#set api key
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_receipt(receipt_url: str):
    #call chat api
    response = openai.chat.completions.create(
    #gpt-4o handle text and image
    model="gpt-4o",
    messages=[
        {
            "role":"system",
            "content": "Extract data from receipt"
        },
        {
            "role":"user",
            "content":[
                {"type":"text", "text": "Extract merchant name and total amount from this receipt "},#text prompt
                {"type":"receipt_url", "receipt_url": {"url":receipt_url}},#receipt to read
            ],
        }
        ],
    max_tokens=200
    )
    text = response.choices[0].message.content #get response from the model
    return text