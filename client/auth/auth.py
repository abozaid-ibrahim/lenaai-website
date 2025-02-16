from fastapi import Security, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from datetime import timedelta, datetime
import jwt
from .model import UserModel
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("secret_key")
ALGORITHM = os.getenv("algorithm")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class Auth:
    def authenticate_user(db, username: str, password: str):
        user = UserModel.get_user(db, username)
        if not user or not UserModel.verify_password(password, user.hashed_password):
            return False
        return user
    
    def create_access_token(data: dict, expires_delta: timedelta):
        to_encode = data.copy()
        expire = datetime.now() + expires_delta
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def get_current_user(token: str = Security(oauth2_scheme)):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise HTTPException(status_code=401, detail="Invalid token")
        except PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = UserModel.get_user(UserModel.temp_users_db, username)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    
