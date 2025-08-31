from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from jose import jwt
from database import login_db
from datetime import datetime, timedelta, timezone

import os
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')
ALGORITHM = "HS256"

router = APIRouter()

def create_access_token(data: dict, expires_delta: timedelta):
    expire = datetime.now(timezone.utc) + expires_delta
    
    data.update({"exp": expire})
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class Packet(BaseModel):
    id : str
    pw : str
@router.post('/info', status_code=200)
def info(packet:Packet):
    import bcrypt
    id = (packet.id).strip()
    pw = (packet.pw).strip()
    
    get_hash = login_db.get_hash()
    
    user_found = False
    for user in get_hash:
        user_id = user['user_id'].encode('utf-8')
        user_pw = user['user_pw'].encode('utf-8')
        
        if bcrypt.checkpw(id.encode('utf-8'), user_id) and bcrypt.checkpw(pw.encode('utf-8'), user_pw):
            user_found = True
            
    if not user_found:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    access_token = create_access_token(
        data={"sub": id}, expires_delta=timedelta(minutes=20) #만료 시간 테스트 해야함. 
    )
    return {"access_token": access_token}
    