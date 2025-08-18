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

def get_staff():
    response = supabase.table('Employee').select('*').eq('active', True).execute()
    return response.data

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

def check_rest(name, date, isWork):
    year, month, day = date.split('-')
    
    response = supabase.table('RestCount').select('halfRest', 'fullRest') \
        .eq('name', name).eq('year', year).eq('month', month).execute()
    record = response.data
    
    if not record:
        insert_data = {
            'name': name,
            'year': year,
            'month': month,
            'halfRest': 0,
            'fullRest': 0
        }
        supabase.table('RestCount').insert(insert_data).execute()
        
        half = 0
        full = 0
    else:
        half = record[0]['halfRest']
        full = record[0]['fullRest']

    if isWork == 'half':
        supabase.table('RestCount').update({'halfRest': half+1}) \
            .eq('name', name).eq('year', year).eq('month', month).execute()
    else:
        supabase.table('RestCount').update({'fullRest': full+1}) \
            .eq('name', name).eq('year', year).eq('month', month).execute()

def record_work(data): #work, home, full만 들어옴
    name = data['name']
    isWork = data['isWork']
    
    iso = data['time']
    date, time = iso.split('T')
    time = time[:8]
    if isWork == 'full':
        time = None

    response = supabase.table('Attendence').select('id') \
        .eq('name', name).eq('date', date).execute()
    record = response.data
    
    if not record:
        insert_data = {
            'name' : name, 
            'date' : date,
            'workTime' : time, 
            'isWork' : isWork
        }
        response = supabase.table('Attendence') \
            .insert(insert_data).execute()
    else:
        if isWork == "work":
            update_data = {
                'workTime': time,
                'isWork' : isWork
            }
        else: #home, full
            update_data = {
                'leaveTime': time,
                'isWork' : isWork
            }
        response = supabase.table('Attendence').update(update_data) \
        .eq('name', name).eq('date', date).execute()
    
    if isWork == 'full': #연차의 경우 횟수 카운트
        check_rest(name, date, 'full')
        
def load_work_record(data):
    name = data['name']
    iso = data['time']
    date, time = iso.split('T')

    response = supabase.table('Attendence').select('isWork', 'isHalf') \
        .eq('name', name).eq('date', date).execute()
        
    record = response.data
    if record:
        return record[0]
    else:
        return {"isWork" : "notwork", "isHalf" : False}

def record_half_use(data):
    name = data['name']
    iso = data['time']
    date, time = iso.split('T')
    
    response = supabase.table('Attendence').select('id') \
        .eq('name', name).eq('date', date).execute()
    record = response.data
    if record:
        supabase.table('Attendence').update({'isHalf' : True}) \
            .eq('name', name).eq('date', date).execute()
    else:
        insert_data = {
            'name': name,
            'date': date,
            'workTime': None,
            'leaveTime': None,
            'isWork': 'notwork',
            'isHalf': True
        }
        supabase.table('Attendence').insert(insert_data).execute()

    check_rest(name, date, 'half') #반차 사용 횟수 체크

def load_rest_record(data):
    year = data['year']
    month = data['month']
    
    active_employee = supabase.table("Employee").select("name") \
        .eq('active', True).execute()
    active = []
    for data in active_employee.data:
        active.append(data['name'])
    
    response = supabase.table("RestCount").select("*").order('name') \
        .eq('year', year).eq('month', month).in_('name', active).execute()
    return response.data