from pydantic import BaseModel
from uuid import UUID
from typing import List

class CreateGroup(BaseModel):
    name: str
    user_id: UUID #logged-in user that create group

class JoinGroup(BaseModel):
    user_id: UUID #logged-in user that wanna join group
    code: str

class CreateBill(BaseModel):
    title: str #bill's title
    payer_id: UUID #logged-in user that create bill
    group_id: UUID
    total_amount: float
    category: str
    shared_user_ids: List[UUID] #list of users who owe money

class ApproveRequest(BaseModel): #return from payer's approval
    user_id: str