from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from database import manager_db
from jose import JWTError, jwt
from typing import Optional

import os
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')
ALGORITHM = "HS256"

router = APIRouter()

def auth_fail():
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="authorized failed",
    )

def check_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        auth_fail()
        return
    
    scheme, token = authorization.split()
    if scheme != "Bearer":
        auth_fail()
        return
    
    try:
        decode = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        if not decode['sub']:
            auth_fail()
        else:
            return decode['sub']
    except:
        auth_fail()

@router.get('/attendance/', status_code=200)
def attendance(name:str, year:int, month:int, token: str = Depends(check_token)):  
    record = manager_db.month_attendance_data(name, year, month)
    return record
    