from database import database
from models import GroupCreate, BillCreate, BillShareCreate

# Groups
async def create_group(group: GroupCreate, created_by: str):
    query = "INSERT INTO groups (name, code, created_by) VALUES (:name, :code, :created_by) RETURNING *"
    return await database.fetch_one(query=query, values={**group.dict(), "created_by": created_by})

# Bills
async def create_bill(bill: BillCreate, payer_id: str):
    query = "INSERT INTO bills (title, total_amount, group_id, payer_id) VALUES (:title, :total_amount, :group_id, :payer_id) RETURNING *"
    return await database.fetch_one(query=query, values={**bill.dict(), "payer_id": payer_id})

# BillShares
async def create_bill_shares(shares: list[BillShareCreate]):
    query = """
    INSERT INTO bill_shares (bill_id, user_id, amount_owed, paid, receipt)
    VALUES (:bill_id, :user_id, :amount_owed, :paid, :receipt)
    """
    for share in shares:
        await database.execute(query=query, values=share.dict())
