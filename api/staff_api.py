from fastapi import APIRouter
from pydantic import BaseModel
from database import staff_db


router = APIRouter()

@router.get('/datetime')
def datetime():
    from datetime import datetime
    now = datetime.now()

    response = {
        "current_datetime": now.isoformat(),
        "year": now.year,
        "month": now.month,
        "day": now.day,
        "hour": f"{now.hour:02}",
        "minute": f"{now.minute:02}",
        "second": f"{now.second:02}",
    }
    return response

@router.get('/active')
def active():
    return staff_db.active_staff()

class StaffState(BaseModel):
    name: str
    year: int
    month: int
    day: int
    time: str
    status: str
@router.post('/changing-state')
def changing_state(staff_state:StaffState):
    staff_db.change_work_home(staff_state)
    return '', 204

@router.get('/state/')
def state(name:str, year:int, month:int, day:int):
    now_state = staff_db.find_today_state(name, year, month, day)
    return now_state, 204

class RestData(BaseModel):
    name: str
    year: int
    date: str
    time: str
    category: str
@router.post('/using-rest')
def using_rest(restdata:RestData):
    staff_db.record_rest(restdata)
    return '', 204