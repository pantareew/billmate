from fastapi import APIRouter, Query
from database import supabase
from models import CreateBill

router = APIRouter(prefix="/bills", tags=["Bills"])

#get all my bills
@router.get("")
def get_my_bills(user_id: str = Query(...)):
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
        shares = supabase.table("bill_shares").select("user_id, amount_owed, paid").eq("bill_id", bill["id"]).execute().data
        #map shares to include user names
        shares_detail = []
        for share in shares:
            #get name of each user
            user = supabase.table("users").select("name").eq("id", share["user_id"]).single().execute().data
            shares_detail.append({
                "user_id": share["user_id"],
                "user_name": user["name"],
                "amount_owed": share["amount_owed"],
                "paid": share["paid"]
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
    owed_raw = supabase.table("bill_shares").select("bill_id, paid").eq("user_id", user_id).execute().data
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
            "my_status": "paid" if item["paid"] else "unpaid"
        })
    #combined payer bills and ower bills
    all_bills = payer_bills + owed_bills
    return {"bills":all_bills}

#get bill details
#@router.get("/{bill_id}")
#def get_bill_detail(bill_id: str):
      #get the particular bill
      #bill = supabase.table("bills").select("*").eq("id", bill_id).single().execute().data
      #get details of people that share this bill
      #shares = supabase.table("bill_shares").select("user_id,amount_owed,paid,receipt,paid_at").eq("bill_id",bill_id).execute().data
      #if not bill:
            #raise HTTPException(status_code=404, detail="Bill not found")
      #return{
            #"bill":bill,
            #"shares":shares
      #}
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
                "paid": False,
                "receipt": None,
                "paid_at": None
            })
        #insert into db
        supabase.table("bill_shares").insert(share_rows).execute()
        return bill.data[0] #return newly created bill
    