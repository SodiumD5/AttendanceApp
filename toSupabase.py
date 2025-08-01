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