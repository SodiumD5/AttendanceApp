from fastapi import FastAPI
from api import staff_api, login_api, manager_api, static_api

app = FastAPI()

app.include_router(staff_api.router, prefix="/staff", tags=['staff'])
app.include_router(login_api.router, prefix="/login", tags=['login'])
app.include_router(manager_api.router, prefix="/manager", tags=['manager'])
app.include_router(static_api.router, prefix="/static", tags=['static'])

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)