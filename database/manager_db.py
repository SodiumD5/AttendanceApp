import os
from dotenv import load_dotenv
from supabase import create_client
from pydantic import BaseModel
import datetime
load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)


def month_attendance_data(name, year, month):
    record = supabase.table('attendance').select('*') \
        .eq('name', name).eq('year', year).eq('month', month).order('day').execute().data
    
    searched_data = []
    for data in record:
        today = f"{year}-{month}-{data['day']}"
        use_datetime = datetime.date(year, month, data['day'])
        weekday = use_datetime.isoweekday()
        dayname = ["", "월", "화", "수", "목", "금", "토", "일"]
        day_return = f"{data['day']}일({dayname[weekday]})"
        rest_status = is_today_rest(name, today)
        searched_data.append({"id" : data['id'], "day" : day_return, "work_time" : data["work_time"], \
            "leave_time" : data["leave_time"], "rest" : rest_status})
    return searched_data
 
def is_today_rest(name, date):
    record = supabase.table('rest').select('category') \
        .eq('name', name).eq('date', date).execute().data
        
    if not record:
        return "X"
    return record[0]['category']

def inactive_staff(name):
    supabase.table('employee').update({'active': False}).eq('name', name).execute()
    
def add_staff(name, enterDay):
    staff_data = supabase.table('employee').select('*').execute().data
    for staff in staff_data:
        if staff['name'] == name:
            if staff['active'] == False:
                supabase.table('employee').update({'active': True}).eq('name', name).execute()
                return "재추가되었습니다."
            return "이미 존재하는 이름입니다."
    
    supabase.table('employee').insert({'name' : name, 'registerDay': enterDay}).execute()
    return "추가되었습니다."

def search_yearly_rest_data(name, year):
    start_date = datetime.date(year, 3, 1) #n년 3월 1일부터 n+1년 3월 1일 하루 전까지의 휴가 데이터 검색
    end_date = datetime.date(year+1, 3, 1) - datetime.timedelta(days=1)
    
    record = supabase.table('rest').select('*').eq('name', name) \
        .gte('date', start_date).lte('date', end_date).order('date').execute().data
    return record

class ModifyDate(BaseModel):
    name : str
    date : str
def modify_enterDate(modifydate:ModifyDate):
    supabase.table('employee').update({'registerDay' : modifydate.date}) \
        .eq('name', modifydate.name).execute()
    
class TotalRest(BaseModel):
    name : str
    year : int
def get_rest_limit(totalrest:TotalRest):
    name = totalrest.name
    year = totalrest.year
    
    record = supabase.table('rest_limit').select('limit') \
        .eq('name', name).eq('year', year).execute().data
    
    if record:
        return record[0]["limit"]
    else:
        insert_data = {
            'name' : name,
            'year' : year,
            'limit' : 15 #기본값
        }
        supabase.table('rest_limit').insert(insert_data).execute()
        return 15

class ModifyTotalRest(BaseModel):
    name : str
    year : int
    limit : int
def modify_rest_limit(modifytotalrest:ModifyTotalRest):
    name = modifytotalrest.name
    year = modifytotalrest.year
    limit = modifytotalrest.limit
    
    supabase.table('rest_limit').update({'limit': limit}) \
        .eq('name', name).eq('year', year).execute()

class ModifyAttendanceData(BaseModel):
    name : str
    year : int
    month : int
    day : int
    work_time : str | None
    leave_time : str | None
    use_rest : str
def modify_staff_work_info(data:ModifyAttendanceData):
    name = data.name
    year = data.year
    month = data.month
    day = data.day
    
    YYYYMMDD = f"{year}-{month}-{day}"
    if data.work_time == "X":
        work_time = None
    else:
        work_time = data.work_time
    if data.leave_time == "X":
        leave_time = None
    else:
        leave_time = data.leave_time
    if data.use_rest == "연차":
        category = "full"
    elif data.use_rest == "반차":
        category = "half"
    else: 
        category = "X"
    
    #attendece부터 바꿈
    attendance_update = {
        "work_time" : work_time,
        "leave_time" : leave_time,
        "status" : "home"
    }
    supabase.table("attendance").update(attendance_update) \
        .eq("name", name).eq("month", month).eq("day", day).execute()
    #rest변경. 이게 많조분이지 슈발
    #반차의 경우, 퇴근시각과 같도록 조정한다. (오전반차 고려 못 함.)
    record = supabase.table("rest").select("category") \
        .eq("date", YYYYMMDD).eq("name", name).execute().data
    if record:
        prev = record[0]["category"]
    else:
        prev = "X"
    
    if category == prev:
        return
    if prev == "X": #추가해야함
        rest_insert = {
            "name" : name, 
            "date" : YYYYMMDD,
            "time" : leave_time,
            "category" : category
        }
        supabase.table("rest").insert(rest_insert).execute()
    elif prev == "half": 
        if category == "X": #행 제거
            supabase.table("rest").delete().eq("name", name).eq("date", YYYYMMDD).execute()
        elif category == "full": #시간 제거, full로 변경
            rest_change = {
                "time" : None,
                "category" : "full"
            }
            supabase.table("rest").update(rest_change).eq("name", name).eq("date", YYYYMMDD).execute()
    elif prev == "full":
        if category == "X": #행 제거
            supabase.table("rest").delete().eq("name", name).eq("date", YYYYMMDD).execute()
        elif category == "half": #시간 추가, half로 변경
            rest_change = {
                "time" : leave_time,
                "category" : "half"
            }
            supabase.table("rest").update(rest_change).eq("name", name).eq("date", YYYYMMDD).execute()