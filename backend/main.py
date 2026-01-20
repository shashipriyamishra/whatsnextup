from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.orchestrator import handle_user_message
from memory.store import init_db
from tasks.store import init_tasks_db
import threading
from tasks.worker import run_worker


app = FastAPI(title="whatsnextup Backend")

# Initialize database
init_db()
init_tasks_db()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class ChatRequest(BaseModel):
    message: str

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "whatsnextup"}

@app.post("/chat")
def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        response = handle_user_message(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#threading.Thread(target=run_worker, daemon=True).start()
