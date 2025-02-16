from passlib.context import CryptContext
from .schemas import UserInDB

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserModel:

    temp_users_db = {}
    
    def get_user(db, username: str):
        user = db.get(username)
        if user:
            return UserInDB(**user)

    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(password):
        return pwd_context.hash(password)