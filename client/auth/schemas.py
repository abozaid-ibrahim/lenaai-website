from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    full_name: str

class UserInDB(User):
    hashed_password: str