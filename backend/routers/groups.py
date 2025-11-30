from fastapi import APIRouter, HTTPException
from models import CreateGroup
from database import supabase
import string
import random

router = APIRouter(prefix="/groups", tags=["Groups"])

#generate group code
def generate_group_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.post("")
def create_group(payload: CreateGroup):
    try:
        code = generate_group_code() 

        group = supabase.table("groups").insert({
            "name": payload.name,
            "created_by": payload.user_id,
            "code": code
        }).execute()

        if not group.data:
            raise HTTPException(status_code=400, detail="Failed to create group")

        #get id of inserted group
        group_id = group.data[0]["id"]

        supabase.table("group_members").insert({
            "group_id": group_id,
            "user_id": payload.user_id
        }).execute()

        return group.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
