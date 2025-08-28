from jinja2 import Environment, FileSystemLoader
import calendar
from . import staff_db, manager_db

def get_days_data(year, month):
    cal = calendar.Calendar()
    days_data = []
    weekdays_korean = ['월', '화', '수', '목', '금', '토', '일']
    
    for day in cal.itermonthdays2(year, month):
        day_num, weekday = day
        
        if day_num == 0:
            continue
        
        day_class = ''
        if weekday == calendar.SATURDAY:
            day_class = 'saturday'
        elif weekday == calendar.SUNDAY:
            day_class = 'sunday'

        days_data.append({
            'day': day_num,
            'weekday_text': weekdays_korean[weekday],
            'class': day_class
        })
    
    return days_data

def makeAttendace(year, month):
    days_data = get_days_data(year, month)
    env = Environment(loader=FileSystemLoader('static'))
    env.globals['list'] = list
    
    #템플릿 채우기
    all_name = staff_db.active_staff()
    name_data = []
    work_data = []
    for i in range(len(all_name)):
        #이름 정보
        now_name = all_name[i]["name"]
        name_data.append({
            'name' : now_name
        })
        #일 정보
        work_data_one_person = manager_db.month_attendance_data(now_name, year, month)
        work_data_month = [{"rest": "", "work_time" : "", "leave_time" : ""} for _ in range(len(days_data))]
        
        work_day = 0
        rest_day = 0
        for one_day_data in work_data_one_person:
            now_day = int(one_day_data["day"].split("일")[0])
            now_rest = one_day_data["rest"]
            if now_rest == "X":
                rest_ko = "출근"
                work_day += 1
            elif now_rest == "half":
                rest_ko = "반차"
                rest_day += 0.5
            elif now_rest == "full":
                rest_ko = "연차"
                rest_day += 1
            
            work_time = ""
            leave_time = ""
            if now_rest != "full":
                work_time, leave_time = manager_db.find_day_work_time(year, month, now_day, now_name)
                
            work_data_month[now_day] = {"rest" : rest_ko, "work_time" : work_time, "leave_time" : leave_time}
        if int(rest_day) == rest_day:
            rest_day = int(rest_day)
        work_data.append({"name" : now_name, "data" : work_data_month, "work_day" : work_day, "rest_day" : rest_day})
    
    template = env.get_template('attendance.html')
    output_html = template.render(
        year=year,
        month=month,
        days_data=days_data,
        works_data=work_data
    )
    return output_html