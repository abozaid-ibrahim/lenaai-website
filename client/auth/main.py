from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from .auth import Auth
from .model import UserModel
from .schemas import User


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ACCESS_TOKEN_EXPIRE_MINUTES = 10080

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = Auth.authenticate_user(UserModel.temp_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = Auth.create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/signup")
async def signup(
    username: str = Form(...), 
    password: str = Form(...), 
    email: str = Form(...), 
    full_name: str = Form(...)
):
    if username in UserModel.temp_users_db:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = UserModel.get_password_hash(password)

    UserModel.temp_users_db[username] = {
        "username": username,
        "full_name": full_name,
        "email": email,
        "hashed_password": hashed_password,
        "disabled": False
    }

    return {"message": "User registered successfully"}

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(Auth.get_current_user)):
    return current_user