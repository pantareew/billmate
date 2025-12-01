from fastapi import FastAPI
from routers import groups, bills
from database import supabase
app = FastAPI()

#include routes from groups
app.include_router(groups.router)

#include routes from bills
app.include_router(bills.router)

@app.get("/")
def root():
    return {"status": "Backend is running"}


