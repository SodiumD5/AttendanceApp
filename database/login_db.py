import os
from dotenv import load_dotenv
from supabase import create_client
from pydantic import BaseModel
load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def get_hash():
    return supabase.table('user').select('*').execute().data