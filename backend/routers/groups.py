from fastapi import APIRouter
from models import GroupCreate
from crud import create_group

router = APIRouter(prefix="/groups", tags=["groups"])

@router.post("/")
async def add_group(group: GroupCreate, user_id: str):
    return await create_group(group, user_id)
