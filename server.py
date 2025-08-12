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
        "hour": now.hour,
        "minute": now.minute,
        "second": now.second,
        "timestamp": now.timestamp()
    }
    
    # JSON 형식으로 응답 전송
    return jsonify(response)

@app.route('/post/loginInfo', methods=['POST'])
def post_loginInfo():
    if request.is_json:
        data = request.get_json()
        
        loginStatus = toSupabase.check_pw(data['id'], data['pw'])
        if loginStatus:
            return jsonify({"message": "Login successfully!"}), 200
        else:
            return jsonify({"message": "wrong data!"}), 400
        
@app.route('/get/staffList', methods=['GET'])
def get_stafflist():
    staff_info = toSupabase.get_staff()
    return jsonify(staff_info)

@app.route('/post/addStaff', methods=['POST'])
def add_staffList():
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
def inactive_staff():
    if request.is_json:
        data = request.get_json()
        toSupabase.inactive_staff(data)
        return jsonify({"message" : "삭제 되었습니다."})

# 서버 시작
if __name__ == '__main__':
    app.run(port = 8000, debug=True)