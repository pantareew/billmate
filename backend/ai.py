from openai import OpenAI
import os
#create openai connection with api key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
#extract receipt
def extract_receipt(receipt_url: str):
    #prompt
    prompt = """
You are a receipt and invoice parser.
Return ONLY valid JSON. No markdown. No explanation.
Classify bill type:
- If the document contains purchasable products → itemized
- If the document only shows an amount due → total_only
Rules:
- If total_only → items must be empty array []
- Each purchased product must be an item
- Never hallucinate items
- Ignore address, phone, cashier, payment method
- Prices must be numbers only (no currency symbols)
- id incremental string starting from "1"
Schema:
{
  "merchant": "string | null",
  "items": [
    { "id": "string", "name": "string", "price": number }
  ],
  "total": number | null
  "bill_type": "itemized | total_only"
}
"""
    #create chat
    response = client.chat.completions.create(
    #gpt-4o-mini handle text and image
    model="gpt-4o-mini",
    messages=[
        {
            "role":"system", #set model's instruction/behavior
            "content": prompt
        },
        {
            "role":"user", #model's task
            "content":[
                {"type":"text", "text": "Parse this receipt"},#text prompt
                {"type":"image_url", "image_url": {"url":receipt_url}},#receipt to read
            ],
        }
        ],
    max_tokens=500
    )
    return response.choices[0].message.content #get response from the model
    