from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Header, Request, Depends
print("🔥 MAIN.PY LOADED 🔥")
print("✅ Backend deployment: CI/CD pipeline active")
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.orchestrator import handle_user_message
from agents.planning_agent import PlanningAgent
from agents.reflection_agent import ReflectionAgent
from agents.memory_agent import MemoryAgent
from firestore.client import init_firebase
from memory.store import init_db
from tasks.store import init_tasks_db
import threading
from tasks.worker import run_worker
from fastapi.responses import JSONResponse
import time
from auth.deps import get_current_user
from datetime import datetime

REQUESTS = {}
MAX_REQUESTS = 10   # per IP
WINDOW = 60         # seconds
app = FastAPI(title="whatsnextup Backend")

# Initialize Firestore
try:
    init_firebase()
    print("✅ Firebase Admin SDK initialized successfully")
except Exception as e:
    print(f"❌ Firebase initialization warning: {e}")
    # Continue even if Firebase fails - some features may still work


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


# Request schemas
class ChatRequest(BaseModel):
    message: str

class PlanRequest(BaseModel):
    goal: str

class ReflectionRequest(BaseModel):
    content: str
    mood: str = "thoughtful"

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
        uid = "anonymous"

    # Use user_id for context in orchestrator
    response = handle_user_message(request.message, uid)

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

# ============ MEMORY ENDPOINTS ============

@app.get("/api/memories")
def get_memories(authorization: str = Header(None)):
    """Retrieve user's saved memories"""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        user = get_current_user(authorization)
        uid = user.get("uid")
        
        memory_agent = MemoryAgent(uid)
        summary = memory_agent.get_memory_summary()
        
        return {
            "memories": summary.get("memories", []),
            "total": summary.get("total", 0)
        }
    except Exception as e:
        print(f"❌ Error getting memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ PLANS ENDPOINTS ============

@app.get("/api/plans")
def get_plans(authorization: str = Header(None)):
    """Retrieve user's plans"""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        user = get_current_user(authorization)
        uid = user.get("uid")
        
        # For now, return empty plans (would fetch from Firestore)
        return {
            "plans": [],
            "total": 0
        }
    except Exception as e:
        print(f"❌ Error getting plans: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plans")
def create_plan(
    request: PlanRequest,
    authorization: str = Header(None)
):
    """Create a new plan from a goal"""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        user = get_current_user(authorization)
        uid = user.get("uid")
        
        planning_agent = PlanningAgent(uid)
        plan = planning_agent.create_plan_from_goal(request.goal)
        
        return {
            "plan": plan,
            "created_at": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"❌ Error creating plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ REFLECTIONS ENDPOINTS ============

@app.get("/api/reflections")
def get_reflections(authorization: str = Header(None)):
    """Retrieve user's reflections"""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        user = get_current_user(authorization)
        uid = user.get("uid")
        
        # For now, return empty reflections (would fetch from Firestore)
        return {
            "reflections": [],
            "total": 0
        }
    except Exception as e:
        print(f"❌ Error getting reflections: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reflections")
def create_reflection(
    request: ReflectionRequest,
    authorization: str = Header(None)
):
    """Create a new reflection"""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        user = get_current_user(authorization)
        uid = user.get("uid")
        
        reflection_agent = ReflectionAgent(uid)
        analysis = reflection_agent.analyze_reflection(request.content)
        
        return {
            "reflection": {
                "id": uid + "_" + str(datetime.now().timestamp()),
                "content": request.content,
                "analysis": analysis,
                "created_at": datetime.now().isoformat()
            }
        }
    except Exception as e:
        print(f"❌ Error creating reflection: {e}")
        raise HTTPException(status_code=500, detail=str(e))
