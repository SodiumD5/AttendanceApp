from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
import os
import pdfkit
from dotenv import load_dotenv
from urllib.parse import quote

load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')
signer = URLSafeTimedSerializer(SECRET_KEY)

from . import manager_api
from database import makeAttendance

router = APIRouter()
@router.get("/attendance/{year}/{month}/{type}", status_code=200)
def make_signed(year : int, month : int, type : str, token: str = Depends(manager_api.check_token)):
    payload = {
        "token": token,
        "year": year,
        "month": month,
        "type": type
    }
    signed_token = signer.dumps(payload)
    
    if type == "web":
        url = f"http://10.0.2.2:8000/static/attendance-web/{signed_token}"
    elif type == "pdf":
        url = f"http://10.0.2.2:8000/static/attendance-pdf/{signed_token}"
    else:
        return
    return {"url": url}

@router.get("/attendance-web/{signed_token}")
def load_attendance_web(signed_token: str):
    try:
        data = signer.loads(signed_token, max_age=300)
        
        token = data.get("token")
        year = data.get("year")
        month = data.get("month")
        type = data.get("type")

        if not token or not year or not month or not type or type != "web":
            raise HTTPException(status_code=400, detail="유효하지 않은 서명입니다.")

        html = makeAttendance.makeAttendace(year, month)
        return HTMLResponse(content=html, status_code=200)

    except SignatureExpired:
        raise HTTPException(status_code=400, detail="링크가 만료되었습니다.")
    except BadTimeSignature:
        raise HTTPException(status_code=400, detail="서명이 유효하지 않습니다.")

    
@router.get("/attendance-pdf/{signed_token}")
async def download_attendance_pdf(signed_token: str):
    try:
        data = signer.loads(signed_token, max_age=300)
        
        token = data.get("token")
        year = data.get("year")
        month = data.get("month")
        type = data.get("type")

        if not token or not year or not month or not type or type != "pdf":
            raise HTTPException(status_code=400, detail="유효하지 않은 서명입니다.")

        html = makeAttendance.makeAttendace(year, month)
        
        # wkhtmltopdf 실행 파일 경로 지정
        path_wkhtmltopdf = 'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe'
        config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

        options = {
            'encoding': 'utf-8',
            'disable-smart-shrinking': None,
            'page-size': 'A4',
            'orientation': 'Landscape',
            'margin-top': '5mm',
            'margin-bottom': '5mm',
            'margin-left': '5mm',
            'margin-right': '5mm',
            'zoom' : 0.95
        }
        pdf_bytes = pdfkit.from_string(html, False, configuration=config, options=options)

        # 파일명 인코딩
        filename = f"{year}년 {month}월 출근부.pdf"
        encoded_filename = quote(filename, encoding='utf-8')
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
            }
        )
    except SignatureExpired:
        raise HTTPException(status_code=400, detail="링크가 만료되었습니다.")
    except BadTimeSignature:
        raise HTTPException(status_code=400, detail="서명이 유효하지 않습니다.")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"서버 내부 오류: {e}")