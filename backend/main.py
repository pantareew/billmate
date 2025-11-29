from fastapi import FastAPI
from database import database
from routers import groups, bills, bill_shares

app = FastAPI()

# Connect to DB on startup
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Include routers
app.include_router(groups.router)
app.include_router(bills.router)
app.include_router(bill_shares.router)
