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
        today = f"{month}/{data['day']}"
        use_datetime = datetime.date(year, month, data['day'])
        weekday = use_datetime.isoweekday()
        dayname = ["", "월", "화", "수", "목", "금", "토", "일"]
        day_return = f"{data['day']}일({dayname[weekday]})"
        rest_status = today_rest(name, year, today)
        searched_data.append({"id" : data['id'], "day" : day_return, "work_time" : data["work_time"], \
            "leave_time" : data["leave_time"], "rest" : rest_status})
    return searched_data
 
def today_rest(name, year, date):
    record = supabase.table('rest').select('category') \
        .eq('name', name).eq('year', year).eq('date', date).execute().data
        
    if not record:
        return "X"
    return record[0]['category']
    