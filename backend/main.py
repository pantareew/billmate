from fastapi import FastAPI
from routers import groups, bills, notifications
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#add cors middleware
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
        "http://localhost:3000",
        "https://billmateandmore.vercel.app",
    ],  #frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#include routes from groups
app.include_router(groups.router)

#include routes from bills
app.include_router(bills.router)

#include routes from notifications
app.include_router(notifications.router)

@app.get("/")
def root():
    return {"status": "Backend is running"}


