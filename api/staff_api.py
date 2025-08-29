from fastapi import APIRouter
from pydantic import BaseModel
from database import staff_db

router = APIRouter()

@router.get('/datetime', status_code=200)
def datetime():
    from datetime import datetime
    now = datetime.now()

    response = {
        "current_datetime": now.isoformat(),
        "date": f"{now.year}-{now.month}-{now.day}",
        "year": now.year,
        "month": now.month,
        "day": now.day,
        "hour": f"{now.hour:02}",
        "minute": f"{now.minute:02}",
        "second": f"{now.second:02}",
    }
    return response

@router.get('/active', status_code=200)
def active():
    return staff_db.active_staff()

class StaffState(BaseModel):
    name: str
    year: int
    month: int
    day: int
    time: str
    status: str
@router.post('/changing-state', status_code=204)
def changing_state(staff_state:StaffState):
    staff_db.change_work_home(staff_state)

@router.get('/state/', status_code=200)
def state(name:str, year:int, month:int, day:int):
    now_state = staff_db.find_today_state(name, year, month, day)
    return now_state

class RestData(BaseModel):
    name: str
    date: str
    time: str | None
    category: str
@router.post('/using-rest', status_code=204)
def using_rest(restdata:RestData):
    staff_db.record_rest(restdata)

@router.get("/ping", status_code=200)
async def ping():
    return {"message": "pong"}