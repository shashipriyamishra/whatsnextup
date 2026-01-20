from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Header, Request, Depends
print("🔥 MAIN.PY LOADED 🔥")
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.orchestrator import handle_user_message
from memory.store import init_db
from tasks.store import init_tasks_db
import threading
from tasks.worker import run_worker
from fastapi.responses import JSONResponse
import time
from auth.deps import get_current_user

REQUESTS = {}
MAX_REQUESTS = 10   # per IP
WINDOW = 60         # seconds
app = FastAPI(title="whatsnextup Backend")

# Initialize database
init_db()
init_tasks_db()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://whatsnextup.com",
        "https://www.whatsnextup.com",
        "https://whatsnextup-d2415.web.app",
    ],
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
def chat(
    request: ChatRequest,
    authorization: str = Header(None)
):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    uid = None
    name = "User"
    
    # Extract user if auth provided
    if authorization:
        try:
            user = get_current_user(authorization)
            uid = user.get("uid")
            name = user.get("name", "User")
            print(f"✅ Auth SUCCESS - User: {uid}")
        except HTTPException as e:
            print(f"❌ Auth FAILED - {e.detail}")
            raise
        except Exception as e:
            print(f"❌ Auth ERROR - {e}")
            raise HTTPException(status_code=401, detail=str(e))
    else:
        print(f"⚠️  No auth header provided - proceeding as anonymous")

    response = handle_user_message(request.message)

    return {
        "user": name,
        "reply": response
    }

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    ip = request.client.host
    now = time.time()

    REQUESTS.setdefault(ip, [])
    REQUESTS[ip] = [t for t in REQUESTS[ip] if now - t < WINDOW]

    if len(REQUESTS[ip]) >= MAX_REQUESTS:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests"}
        )

    REQUESTS[ip].append(now)
    return await call_next(request)

#threading.Thread(target=run_worker, daemon=True).start()
