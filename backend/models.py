from pydantic import BaseModel

class CreateGroup(BaseModel):
    name: str
    user_id: str #logged-in user that create group
