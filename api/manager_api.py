from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from database import manager_db
from jose import jwt
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

@router.put('/{name}/deactivate', status_code=204)
def deactivate(name:str, token: str = Depends(check_token)):
    manager_db.inactive_staff(name)
    
class NewStaff(BaseModel):
    staff_name: str
    enroll_date: str
@router.post('/enrollment', status_code=200)
def enrollment(newstaff:NewStaff, token: str = Depends(check_token)):
    staff_name = newstaff.staff_name.strip()
    return manager_db.add_staff(staff_name, newstaff.enroll_date)

@router.get('/rest/{staff_name}/{year}', status_code=200)
def rest(staff_name:str, year:int, token: str = Depends(check_token)):
    record = manager_db.search_yearly_rest_data(staff_name, year)
    
    count = 0
    for index, item in enumerate(record):
        if item["category"] == "full":
            count += 1
        else:
            count += 0.5
        
        if int(count) == count: #소수점 안 나오도록 조정
            record[index]['count'] = f"{int(count)}회"
        else:
            record[index]['count'] = f"{count}회"
            
        if not item["time"]:
            item["time"] = "연차"
        else:
            hour, minute = item["time"].split(":")
            
            item["time"] = f"{int(hour)}시 {int(minute)}분"
            
    return {"info" : record, "count" : count}

class ModifyDate(BaseModel):
    name : str
    date : str
@router.put('/modification/enterDate', status_code=204)
def modify_enterDate(modifydate:ModifyDate, token: str = Depends(check_token)):
    return manager_db.modify_enterDate(modifydate)

class TotalRest(BaseModel):
    name : str
    year : int
@router.post('/rest/limit', status_code=200)
def rest_limit(totalrest:TotalRest, token: str = Depends(check_token)):
    return manager_db.get_rest_limit(totalrest)

class ModifyTotalRest(BaseModel):
    name : str
    year : int
    limit : int
@router.put('/modification/rest', status_code=204)
def modify_rest(modifytotalrest:ModifyTotalRest, token: str = Depends(check_token)):
    manager_db.modify_rest_limit(modifytotalrest)
    
class ModifyAttendenceData(BaseModel):
    name : str
    year : int
    month : int
    day : int
    work_time : str
    leave_time : str
@router.put('/modification/attendence', status_code=204)
def modfiy_attendence(modifyattendencedate:ModifyAttendenceData, token: str = Depends(check_token)):
    print(modifyattendencedate)