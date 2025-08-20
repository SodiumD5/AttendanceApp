import os
from dotenv import load_dotenv

from supabase import create_client

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)

def check_pw(user_id, user_pw):
    response = supabase.table('Admin').select('id').eq('user_id', user_id).eq('user_pw', user_pw).execute()
    
    if response.data:
        return True
    else:
        return False

def add_staff(staff_name, enterDay):
    staff_data = supabase.table('Employee').select('*').execute().data
    for staff in staff_data:
        if staff['name'] == staff_name:
            if staff['active'] == False:
                supabase.table('Employee').update({'active': True}).eq('name', staff_name).execute()
                return "재추가"
            return "중복됨"
    
    supabase.table('Employee').insert({'name' : staff_name, 'registerDay': enterDay}).execute()
    return "추가됨"
    
def inactive_staff(staff_name):
    supabase.table('Employee').update({'active': False}).eq('name', staff_name).execute()

def load_active_employee():
    active_employee = supabase.table("Employee").select("name") \
        .eq('active', True).execute()
    active = []
    for data in active_employee.data:
        active.append(data['name'])
    return active

def load_rest_record(data):
    year = data['year']
    month = data['month']
    
    active = load_active_employee()
    response = supabase.table("RestCount").select("*").order('name') \
        .eq('year', year).eq('month', month).in_('name', active).execute()
    return response.data

def load_work_data(data):
    year = data['year']
    month = data['month']
    name = data['name']

    import datetime
    startDate = datetime.date(year, month, 1)
    daylength = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] #끝날짜 구하기
    if (year%4 == 0 and year%100 != 0) or year%400 == 0: #윤년
        daylength[2] -= 1
    endDate = datetime.date(year, month, daylength[month])
 
    response = supabase.table("Attendance").select("*").eq("name", name) \
        .gte('date', startDate).lte('date', endDate).order("date").execute()
    records = response.data
    
    work_data = []
    for record in records:
        day = int(record['date'][8:10])
        use_datetime = datetime.date(year, month, day)
        weekday = use_datetime.isoweekday()
        dayname = ["", "월", "화", "수", "목", "금", "토", "일"]
        
        day = f"{day}일 ({(dayname[weekday])})"
        if record['isWork'] == 'full':
            restInfo = "연차"
        elif record['isHalf']:
            restInfo = "반차"
        else:
            restInfo = "X"
        work_data.append({"date" : day, "workTime" : record['workTime'], "leaveTime" : record['leaveTime'], "rest" : restInfo})
    return work_data