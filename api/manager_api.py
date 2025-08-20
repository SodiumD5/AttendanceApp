from fastapi import APIRouter
from pydantic import BaseModel
from database import manager_db

router = APIRouter()

@router.get('/post/workData')
def workData():
    if request.is_json:
        data = request.get_json()
        response = toSupabase.load_work_data(data)
        return jsonify(response), 200
