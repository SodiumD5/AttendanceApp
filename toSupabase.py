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
    