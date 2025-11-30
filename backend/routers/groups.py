from fastapi import APIRouter, HTTPException, Query
from models import CreateGroup
from database import supabase
import string, random

router = APIRouter(prefix="/groups", tags=["Groups"])

#generate group code
def generate_group_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)) #6 random chars of uppercase letters and digits 
#get
@router.get("")
def get_my_group(user_id: str = Query(...)):
    #fetch group id from group_members table where user belongs
    membership = supabase.table("group_members").select("group_id").eq("user_id",user_id).execute()
    #extract only group_id from data
    group_ids = [m["group_id"] for m in membership.data]
    #no my groups
    if not group_ids:
        return {"groups": []}
    #get details of each group
    groups = supabase.table("groups").select("*").in_("id", group_ids).execute()
    return {"groups": groups.data}
#post
@router.post("")
def create_group(payload: CreateGroup):
    try:
        code = generate_group_code() 
        #insert new group into db
        group = supabase.table("groups").insert({
            "name": payload.name,
            "created_by": payload.user_id,
            "code": code
        }).execute()

        if not group.data:
            raise HTTPException(status_code=400, detail="Failed to create group")

        #get id of inserted group
        group_id = group.data[0]["id"]

        #insert group's creator into group_members
        supabase.table("group_members").insert({
            "group_id": group_id,
            "user_id": payload.user_id
        }).execute()
        return group.data[0] #return newly created group to frontend
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
