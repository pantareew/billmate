from fastapi import APIRouter
from database import supabase
from models import CreateBill

router = APIRouter(prefix="/bills", tags=["Bills"])

@router.get("")

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
    