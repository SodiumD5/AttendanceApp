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
        
        

# 서버 시작
if __name__ == '__main__':
    app.run(port = 8000, debug=True)