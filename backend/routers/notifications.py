from fastapi import APIRouter, Query
from database import supabase

router = APIRouter(prefix="/notifications", tags=["Notifications"])

#get all notifications for a user
@router.get("")
def get_notifications(user_id: str = Query(...)):
    result = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return {"notifications": result.data}

#mark a notification as read
@router.post("/{notification_id}/read")
def mark_as_read(notification_id: str):
    supabase.table("notifications").update({"read",True}).eq("id",notification_id).execute()
    return {"status": "read"}