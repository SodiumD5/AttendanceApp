from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import HTMLResponse
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
import os

from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')
signer = URLSafeTimedSerializer(SECRET_KEY)

from . import manager_api
from database import makeAttendance

router = APIRouter()
        
@router.get("/attendance/{year}/{month}", status_code=200)
def make_signed(year : int, month : int, token: str = Depends(manager_api.check_token)):
    payload = {
        "token": token,
        "year": year,
        "month": month
    }
    signed_token = signer.dumps(payload)
    
    url = f"http://10.0.2.2:8000/static/attendance-signed/{signed_token}"
    return {"url": url}

@router.get("/attendance-signed/{signed_token}")
def get_signed_attendance(signed_token: str):
    try:
        data = signer.loads(signed_token, max_age=300)
        
        token = data.get("token")
        year = data.get("year")
        month = data.get("month")

        if not token or not year or not month:
            raise HTTPException(status_code=400, detail="유효하지 않은 서명입니다.")

        html = makeAttendance.makeAttendace(year, month)
        return HTMLResponse(content=html, status_code=200)

    except SignatureExpired:
        raise HTTPException(status_code=400, detail="링크가 만료되었습니다.")
    except BadTimeSignature:
        raise HTTPException(status_code=400, detail="서명이 유효하지 않습니다.")