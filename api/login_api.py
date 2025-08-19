from fastapi import APIRouter
from database import login_db

router = APIRouter()

@router.get('/info')
def info():
    pass
    # if request.is_json:
    #     data = request.get_json()
        
    #     loginStatus = toSupabase.check_pw(data['id'], data['pw'])
    #     if loginStatus:
    #         return jsonify({"message": "Login successfully!"}), 200
    #     else:
    #         return jsonify({"message": "wrong data!"}), 400