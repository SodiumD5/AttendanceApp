from flask import Flask, jsonify, request
from datetime import datetime
import toSupabase

app = Flask(__name__)

@app.route('/get/datetime', methods=['GET'])
def get_datetime():
    now = datetime.now()

    # JSON 응답 생성
    response = {
        "current_datetime": now.isoformat(),
        "year": now.year,
        "month": now.month,
        "day": now.day,
        "hour": f"{now.hour:02}",
        "minute": f"{now.minute:02}",
        "second": f"{now.second:02}",
    }
    
    # JSON 형식으로 응답 전송
    return jsonify(response)

@app.route('/post/loginInfo', methods=['POST'])
def loginInfo():
    if request.is_json:
        data = request.get_json()
        
        loginStatus = toSupabase.check_pw(data['id'], data['pw'])
        if loginStatus:
            return jsonify({"message": "Login successfully!"}), 200
        else:
            return jsonify({"message": "wrong data!"}), 400
        
@app.route('/get/staffList', methods=['GET'])
def staffList():
    staff_info = toSupabase.get_staff()
    return jsonify(staff_info)

@app.route('/post/addStaff', methods=['POST'])
def addStaff():
    if request.is_json:
        data = request.get_json()
        response = toSupabase.add_staff(data['name'], data['registerDay'])
        if response == "중복됨":
            return jsonify({"message" : "이미 존재하는 이름입니다"}), 400
        elif response == "재추가":
            return jsonify({"message" : "재추가되었습니다"}), 200
        else:
            return jsonify({"message" : "추가되었습니다"}), 200

@app.route('/post/inactive', methods=['post'])
def inactive():
    if request.is_json:
        data = request.get_json()
        toSupabase.inactive_staff(data)
        return jsonify({"message" : "삭제 되었습니다."})

@app.route('/post/work', methods=['post'])
def work():
    if request.is_json:
        data = request.get_json()
        toSupabase.record_work(data)
        return '', 204
    
@app.route('/post/workstate', methods=['post'])
def workstate():
    if request.is_json:
        data = request.get_json()
        response = toSupabase.load_work_record(data)
        return jsonify(response), 200

@app.route('/post/useHalf', methods=['post'])
def useHalf():
    if request.is_json:
        data = request.get_json()
        toSupabase.record_half_use(data)
        return '', 204

@app.route('/post/restData', methods=['post'])
def restData():
    if request.is_json:
        data = request.get_json()
        response = toSupabase.load_rest_record(data)
        return jsonify(response), 200

@app.route('/post/workData', methods=['post'])
def workData():
    if request.is_json:
        data = request.get_json()
        response = toSupabase.load_work_data(data)
        return jsonify(response), 200
    
@app.route('/get/active', methods=['get'])
def active():
    active_data = toSupabase.load_active_employee()
    return jsonify(active_data), 200
    
# 서버 시작
if __name__ == '__main__':
    app.run(port = 8000, debug=True)