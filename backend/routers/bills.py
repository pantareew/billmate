from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from database import supabase
from models import CreateBill, ApproveRequest, SplitBill
from datetime import datetime, timezone
import uuid
from ai import extract_receipt
from collections import defaultdict

router = APIRouter(prefix="/bills", tags=["Bills"])

@router.get("")
def get_my_bills(user_id: str):
    all_users = supabase.table("users").select("id, name").execute().data or []
    user_map = {u["id"]: u["name"] for u in all_users}

    all_groups = supabase.table("groups").select("id, name").execute().data or []
    group_map = {g["id"]: g["name"] for g in all_groups}
    #payer bills
    payer_bills_raw = supabase.table("bills").select("*").eq("payer_id", user_id).execute().data or []
    payer_bills = []
    #fetch all bill shares for payer bills
    bill_ids = [bill["id"] for bill in payer_bills_raw]
    shares_raw = supabase.table("bill_shares").select("bill_id, user_id, amount_owed, paid, receipt")\
        .in_("bill_id", bill_ids).execute().data or []
    #share users
    shares_by_bill = {}
    for share in shares_raw:
        shares_by_bill.setdefault(share["bill_id"], []).append(share)

    for bill in payer_bills_raw:
        shares_detail = [
            {
                "user_id": s["user_id"],
                "user_name": user_map.get(s["user_id"], "Unknown"),
                "amount_owed": s["amount_owed"],
                "paid": s["paid"],
                "receipt": s["receipt"]
            }
            for s in shares_by_bill.get(bill["id"], [])
        ]

        payer_bills.append({
            "id": bill["id"],
            "title": bill["title"],
            "group_name": group_map.get(bill["group_id"], "Unknown"),
            "total_amount": bill["total_amount"],
            "created_at": bill["created_at"],
            "payer_id": bill["payer_id"],
            "payer_name": user_map.get(bill["payer_id"], "Unknown"),
            "shares": shares_detail
        })

    #bills that user owes
    owed_raw = supabase.table("bill_shares").select("bill_id, paid, amount_owed")\
        .eq("user_id", user_id).execute().data or []

    owed_bills = []
    owed_bill_ids = [item["bill_id"] for item in owed_raw]
    owed_bills_data = supabase.table("bills").select("*").in_("id", owed_bill_ids).execute().data or []

    for item in owed_raw:
        bill = next((b for b in owed_bills_data if b["id"] == item["bill_id"]), None)
        if not bill:
            continue
        owed_bills.append({
            "id": bill["id"],
            "title": bill["title"],
            "group_name": group_map.get(bill["group_id"], "Unknown"),
            "total_amount": bill["total_amount"],
            "created_at": bill["created_at"],
            "payer_id": bill["payer_id"],
            "payer_name": user_map.get(bill["payer_id"], "Unknown"),
            "my_status": item["paid"],
            "amount_owed": item["amount_owed"]
        })

    #combine bills
    all_bills = payer_bills + owed_bills
    return {"bills": all_bills}

'''
#get all my bills
@router.get("")
def get_my_bills(user_id: str):
    #bills that user paid
    payer_bills_raw = supabase.table("bills").select("*").eq("payer_id", user_id).execute().data
    payer_bills = []   
    #loop through each payer bill
    for bill in payer_bills_raw:
        #get group name
        group = supabase.table("groups").select("name").eq("id", bill["group_id"]).single().execute().data
        #get payer name
        payer = supabase.table("users").select("name").eq("id", bill["payer_id"]).single().execute().data
        #get bill shares for this bill
        shares = supabase.table("bill_shares").select("user_id, amount_owed, paid, receipt").eq("bill_id", bill["id"]).execute().data
        #map shares to include user names
        shares_detail = []
        for share in shares:
            #get name of each user
            user = supabase.table("users").select("name").eq("id", share["user_id"]).single().execute().data
            shares_detail.append({
                "user_id": share["user_id"],
                "user_name": user["name"],
                "amount_owed": share["amount_owed"],
                "paid": share["paid"],
                "receipt":share["receipt"]
            })
        #include all data to return
        payer_bills.append({
            "id": bill["id"],
            "title": bill["title"],
            "group_name": group["name"],
            "total_amount": bill["total_amount"],
            "created_at": bill["created_at"],
            "payer_id": bill["payer_id"],
            "payer_name": payer["name"],
            "shares": shares_detail
        })
    #bills that user owes
    owed_raw = supabase.table("bill_shares").select("bill_id, paid, amount_owed").eq("user_id", user_id).execute().data
    owed_bills = []
    for item in owed_raw:
         bill = supabase.table("bills").select("*").eq("id", item["bill_id"]).single().execute().data
         group = supabase.table("groups").select("name").eq("id", bill["group_id"]).single().execute().data
         payer = supabase.table("users").select("name").eq("id", bill["payer_id"]).single().execute().data
         owed_bills.append({
            "id": bill["id"],
            "title": bill["title"],
            "group_name": group["name"],
            "total_amount": bill["total_amount"],
            "created_at": bill["created_at"],
            "payer_id": bill["payer_id"],
            "payer_name": payer["name"],
            "my_status": item["paid"],
            "amount_owed":item["amount_owed"]
        })
    #combined payer bills and ower bills
    all_bills = payer_bills + owed_bills
    return {"bills":all_bills}
'''
#get total amount that user owes and others owe user
@router.get("/summary")
def get_bill_summary(user_id: str):
    try:
        #query 1 - what you owe
        shares = (
            supabase.table("bill_shares")
            .select("amount_owed, bills!inner(payer_id, users!inner(name))")
            .eq("user_id", user_id)
            .in_("paid", ["unpaid", "pending"])
            .execute()
            .data
        )
        you_owe_map = defaultdict(float) #set each key to have default value of 0.0
        for s in shares:
            payer_name = s["bills"]["users"]["name"]
            you_owe_map[payer_name] += s["amount_owed"]

        you_owe = [
            {"name": name, "amount": round(amount, 2)}
            for name, amount in you_owe_map.items()
        ]
        #query 2 what others owe you
        owed_shares = (
            supabase.table("bill_shares")
            .select("amount_owed, users!inner(name), bills!inner(payer_id)")
            .eq("bills.payer_id", user_id)
            .in_("paid", ["unpaid", "pending"])
            .neq("user_id", user_id)  # Exclude self
            .execute()
            .data
        )

        owed_you_map = defaultdict(float)

        #group total amount of each user
        for item in owed_shares:
            user_name = item["users"]["name"]
            owed_you_map[user_name] += item["amount_owed"]
        owed_you = [
            {"name": name, "amount": round(amount, 2)}
            for name, amount in owed_you_map.items()
        ]
        return {"you_owe": you_owe, "owed_you": owed_you}
    except Exception as e:
        print(f"Error fetching summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
#create new bill
@router.post("")
def create_bill(payload: CreateBill):
        #insert bill
        bill = supabase.table("bills").insert({
            "title": payload.title,
            "total_amount":payload.total_amount,
            "group_id":str(payload.group_id),
            "payer_id":str(payload.payer_id),
            "category":payload.category
        }).execute()
        #get id of inserted bill
        bill_id = bill.data[0]["id"]
        #include payer in shares
        bill_share_users = payload.shared_user_ids + [payload.payer_id]
        #auto split
        split_amount = payload.total_amount/len(bill_share_users)
        #insert bill shares
        share_rows = []
        #loop through users that owe money
        for user_id in payload.shared_user_ids:
            share_rows.append({
                "bill_id":bill_id,
                "user_id":str(user_id),
                "amount_owed":split_amount,
                "paid": "unpaid",
                "receipt": None,
                "paid_at": None
            })
        #insert into db
        supabase.table("bill_shares").insert(share_rows).execute()
        return bill.data[0] #return newly created bill

#approve payment for a specific user
@router.post("/{bill_id}/approve")
def approve_receipt(bill_id: str, payload: ApproveRequest):
     #get user_id from body request
     user_id = payload.user_id 
     #no user passed in for approval
     if not user_id:
        raise HTTPException(status_code=400, detail="Missing user_id")
     #update bill_shares by marking paid
     result = supabase.table("bill_shares").update({"paid": "paid"}).eq("bill_id",bill_id).eq("user_id",user_id).execute()
     if not result.data:
        raise HTTPException(status_code=400, detail="Approval failed")
     return result.data[0]

#pay for bill share
#@router.post("/{bill_id}/pay")
#def pay_bill(bill_id:str, payload:dict): #payload: {user_id:str, receipt:str}
     #user_id = payload.get("user_id")
     #receipt = payload.get("receipt_url")
     #if not user_id or not receipt:
          #raise HTTPException(status_code=400, detail="Missing user_id or receipt")
     #update bill_shares with receipt and paid_at then mark as pending
     #result = supabase.table("bill_shares").update({"receipt":receipt, "paid":"pending","paid_at":"NOW()"}).eq("bill_id",bill_id).eq("user_id",user_id).execute()
     #return result.data[0]

#upload rceipt for ower
@router.post("/{bill_id}/upload_receipt")
async def upload_receipt(bill_id: str, 
                         user_id: str = Form(...), #user_id comes from FormData 
                         file: UploadFile = File(...)): #actual receipt file
     print(f"Received: bill_id={bill_id}, user_id={user_id}, file={file.filename}")
     if not user_id or not file:
        raise HTTPException(status_code=400, detail="Missing user_id or file")
     try: 
        #convert uploaded file into binary
        contents = await file.read()
        file_path = f"{bill_id}/{user_id}/{file.filename}"
        #upload file to storage
        supabase.storage.from_("receipts").upload(file_path, contents, file_options={ "content-type": file.content_type,
        "upsert": "true"})
        #get file url
        receipt_url = supabase.storage.from_("receipts").get_public_url(file_path)
        #update bill_shares with receipt url
        supabase.table("bill_shares").update({"receipt":receipt_url, "paid_at":datetime.now(timezone.utc).isoformat(), "paid":"pending"}).eq("bill_id",bill_id).eq("user_id",user_id).execute()
        #get payer id and bill title for notifications
        bill_data = supabase.table("bills").select("payer_id", "title").eq("id", bill_id).execute()
        payer_id = bill_data.data[0]["payer_id"]
        title = bill_data.data[0]["title"]
        #get user name
        user_data = supabase.table("users").select("name").eq("id", user_id).execute()
        user_name = user_data.data[0]["name"]
        #notify payer for approval
        notifications = [
            {
                "user_id": payer_id,
                "bill_id": bill_id,
                "type": "receipt_uploaded",
                "message": f"{user_name} uploaded a receipt for bill: {title}"
            }
        ]
        supabase.table("notifications").insert(notifications).execute()
        return {"paid":"pending","receipt_url":receipt_url}
     except Exception as e:
        print("Error uploading receipt:", e)
        raise HTTPException(status_code=500, detail=str(e))

#upload main bill
@router.post("/upload")
def upload_main_bill(
    receipt: UploadFile = File(...), #receipt file
    user_id: str = Form(...)
):
    #get file externsion
    file__ext = receipt.filename.split(".")[-1]
    #create unique filename
    file_name = f"{uuid.uuid4()}.{file__ext}"
    #file path
    file_path = f"bills/{file_name}"
    #convert file to binary
    contents = receipt.file.read()
    #upload to storage
    supabase.storage.from_("receipts").upload(file_path, contents, {"content-type": receipt.content_type})
    #get public url
    public_url = supabase.storage.from_("receipts").get_public_url(file_path)
    #insert into bills table
    bill = supabase.table("bills").insert({
        "title": "Draft bill", #will updated by AI later
        "total_amount": 0, #will updated by AI later
        "payer_id": user_id,
        "group_id": None, #user will update later
        "created_at": datetime.now(timezone.utc).isoformat(),
        "receipt": public_url
    }).execute()
    #get bill id
    bill_id = bill.data[0]["id"]
    #AI extraction
    ai_result = extract_receipt(public_url)
    #get total amount from ai result
    import re #import regex
    match = re.search(r"\$?(\d+(\.\d{2})?)", ai_result) #get string that match with amount pattern
    #convert matched str amount to num
    total_amount = float(match.group(1)) if match else 0
    #title_pattern = r'(?i)merchant\s*name\s*(?:is|:)?\s*["“]?(.*?)["”]?[.,]?(?:|\n|\s+and\b|$)'
    title_pattern = r'(?i)merchant\s*name\s*(?:is|:)?\s*["“]?(.+?)(?:,|\s+and\b|\.|\n|$)'
    #get only merchant name from ai result
    title_match = re.search(title_pattern, ai_result)
    title = title_match.group(1).strip('" ').rstrip('.,') if title_match else "Unknown"
    #update bill with data from AI
    supabase.table("bills").update({"title":title, "total_amount":total_amount}).eq("id", bill_id).execute()
    return {
        "bill_id": bill_id,
        "receipt": public_url,
        "ai_result":ai_result,
        "total_amount":total_amount,
        "title": title
    }
#update uploaded bill with group and split bill
@router.post("/split")
def split_bill(payload: SplitBill):
    bill_id = payload.bill_id
    group_id = payload.group_id
    share_users = payload.shared_users
    total_amount = payload.total_amount
    title = payload.title
    #update bill with group_id
    supabase.table("bills").update({"group_id":group_id}).eq("id", bill_id).execute()
    #calculate split
    split_amount = total_amount/(len(share_users)+1) #plus payer
    #create dict for each share user to insert
    shares = [{
        "bill_id": bill_id,
        "user_id": uid,
        "amount_owed":split_amount,
        "paid": "unpaid",
        "receipt": None,
        "paid_at": None
    } for uid in share_users]
    #insert shares into db
    supabase.table("bill_shares").insert(shares).execute()
    #notify users about new bill
    if share_users:
        notifications = [
        {  
        "user_id": uid,
        "bill_id": bill_id,
        "type": "new_bill",
        "message":f"You have been added to a new bill: {title}"
        }
        for uid in share_users]
        supabase.table("notifications").insert(notifications).execute()
    return {"amount_owed":split_amount}