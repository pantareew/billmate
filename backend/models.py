from pydantic import BaseModel
from typing import Optional, List

# Group
class GroupCreate(BaseModel):
    name: str
    code: str

class Group(BaseModel):
    id: int
    name: str
    code: str
    created_by: str

# Bill
class BillCreate(BaseModel):
    title: str
    total_amount: float
    group_id: int

class Bill(BaseModel):
    id: int
    title: str
    total_amount: float
    group_id: int
    payer_id: str

#billShare
class BillShareCreate(BaseModel):
    bill_id: int
    user_id: str
    amount_owed: float
    paid: bool = False
    receipt: Optional[str] = None
