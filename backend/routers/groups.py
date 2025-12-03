from fastapi import APIRouter, HTTPException, Query
from models import CreateGroup, JoinGroup
from database import supabase
import string, random

router = APIRouter(prefix="/groups", tags=["Groups"])

#generate group code
def generate_group_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)) #6 random chars of uppercase letters and digits 
#get my groups
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
    return groups.data
#get group's members
@router.get("/{group_id}/members")
def get_group_members(group_id: str):
    members = supabase.table("group_members").select("user_id, users(id,name)").eq("group_id", group_id).execute()
    return members.data
#post
@router.post("")
#create group
def create_group(payload: CreateGroup):
    try:
        code = generate_group_code() 
        #insert new group into db
        group = supabase.table("groups").insert({
            "name": payload.name,
            "created_by": str(payload.user_id),
            "code": code
        }).execute()

        if not group.data:
            raise HTTPException(status_code=400, detail="Failed to create group")

        #get id of inserted group
        group_id = group.data[0]["id"]

        #insert group's creator into group_members
        supabase.table("group_members").insert({
            "group_id": group_id,
            "user_id": str(payload.user_id)
        }).execute()
        return group.data[0] #return newly created group to frontend
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#join group
@router.post("/join")
def join_group(payload:JoinGroup):
    #get group by code
    group = supabase.table("groups").select("*").eq("code",payload.code).single().execute()
    if not group.data:
        return {"error": "Group code not found"}
    group_id = group.data["id"]
    #check if user already in group
    existing = supabase.table("group_members").select("*").eq("group_id",group_id).eq("user_id",str(payload.user_id)).execute()
    if existing.data:
        return {"error":"User already in the group"}
    #add user to the group
    supabase.table("group_members").insert({
        "user_id":str(payload.user_id), 
        "group_id":group_id
    }).execute()
    return {"message": f"You are now in group '{group.data['name']}'!"}