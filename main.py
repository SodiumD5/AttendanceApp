from fastapi import FastAPI
from api import staff_api, login_api, manager_api, static_api
import asyncio
import httpx
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()
URL = os.environ.get("URL")

app = FastAPI()

app.include_router(staff_api.router, prefix="/staff", tags=['staff'])
app.include_router(login_api.router, prefix="/login", tags=['login'])
app.include_router(manager_api.router, prefix="/manager", tags=['manager'])
app.include_router(static_api.router, prefix="/static", tags=['static'])

#1분에 한 번씩 ping을 보내서 sleep방지
async def keep_awake():
    while True:
        try:
            async with httpx.AsyncClient() as client:
                await client.get(f"{URL}/staff/ping")
        except Exception as e:
            print("Keep-alive failed:", e)
        await asyncio.sleep(60) 

async def main():
    server = asyncio.create_task(
        uvicorn.Server(uvicorn.Config("main:app", host="0.0.0.0", port=8000, reload=True)).serve()
    )
    keep = asyncio.create_task(keep_awake())
    await asyncio.gather(server, keep)
    
if __name__ == '__main__':
    asyncio.run(main())