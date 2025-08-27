from jinja2 import Environment, FileSystemLoader
import calendar

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
    template = env.get_template('attendance.html')
    output_html = template.render(
        year=year,
        month=month,
        days_data=days_data
    )
    return output_html
