from fastapi import APIRouter, Query
from database import supabase
from models import CreateBill

router = APIRouter(prefix="/bills", tags=["Bills"])

#get all my bills
@router.get("")
def get_bill(user_id: str=Query(...)):
      #bills that user paid
      paid_bills = supabase.table("bills").select("*").eq("payer_id", user_id).execute().data
     #bills that user owes
      owed = supabase.table("bill_shares").select("bill_id,bills(*)").eq("user_id", user_id).execute().data
      #get only details from bills for owed bills
      owed_bills = [item["bills"] for item in owed]
      #combine bills
      all_bills = {bill["id"]: bill for bill in (paid_bills + owed_bills)}
      return list(all_bills.values())
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
    