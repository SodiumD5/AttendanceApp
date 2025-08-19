import os
from dotenv import load_dotenv
from supabase import create_client
from pydantic import BaseModel
load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def active_staff():
    response = supabase.table('employee').select('*').eq('active', True).execute().data
    return response

class StaffState(BaseModel):
    name: str
    year: int
    month: int
    day: int
    time: str
    status: str
def change_work_home(data:StaffState): #work, home만 들어옴
    name = data.name
    year = data.year
    month = data.month
    day = data.day
    time = data.time
    status = data.status

    record = supabase.table('attendence').select('id') \
        .eq('name', name).eq('year', year).eq('month', month).eq('day', day).execute().data
    
    if not record: #기록이 없으면 무조건 not_work상태임
        insert_data = {
            'name' : name, 
            'year' : year,
            'month' : month,
            'day' : day,
            'work_time' : time, 
            'status' : status
        }
        supabase.table('attendence') \
            .insert(insert_data).execute()
    else: 
        if status == "work": #반차(행 생성)->출근->퇴근
            update_data = {
                'work_time': time,
                'status' : status
            }
        elif status == "home": #출근->퇴근
            update_data = {
                'leave_time': time,
                'status' : status
            }
        supabase.table('attendence').update(update_data) \
            .eq('name', name).eq('year', year).eq('month', month).eq('day', day).execute()

def find_today_state(name, year, month, day):
    record = supabase.table('attendence').select("status") \
        .eq('name', name).eq('year', year).eq('month', month).eq('day', day).execute().data
    
    if not record:
        return {'status' : 'not_work', 'ishalf' : False}
    else:
        today_state = record[0]['status']
        today = f"{month}:{day}"
        record = supabase.table('rest').select("category") \
        .eq('name', name).eq('year', year).eq('date', today).execute().data

        if not record:
            return {'status' : today_state, 'ishalf' : False}
        else:
            return {'status' : today_state, 'ishalf' : True}

class RestData(BaseModel):
    name: str
    year: int
    date: str
    time: str
    category: str
def record_rest(data: RestData):
    data_dict = data.model_dump()
    supabase.table('rest').insert(data_dict).execute()
    
    if data.category == 'full': #연차의 경우 행이 없음
        month, day = map(int, data.date.split(":"))
        insert_data = {
            "name":data.name,
            "year":data.year,
            "month":month,
            "day":day,
            "status":"full"
        }
        supabase.table('attendence').insert(insert_data).execute()
