from fastapi import FastAPI
from routers import groups
from database import supabase
app = FastAPI()

#include routes from groups
app.include_router(groups.router)

@app.get("/")
def root():
    return {"status": "Backend is running"}


