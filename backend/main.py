from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Header, Request, Depends
print("🔥 MAIN.PY LOADED 🔥")
print("✅ Backend deployment: CI/CD pipeline active")
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

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

class RefineRequest(BaseModel):
    draft_id: str
    field: str
    value: str
    plan_data: dict

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
def get_memories(user: dict = Depends(get_current_user)):
    """Retrieve user's saved memories"""
    try:
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


@app.post("/api/memories/draft")
def create_memory_draft(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Create an initial memory draft for interactive refinement"""
    try:
        uid = user.get("uid")
        print(f"📝 Creating memory draft for user: {uid}")
        
        from agents.memory_draft_manager import MemoryDraftManager
        draft_mgr = MemoryDraftManager(uid)
        
        draft = draft_mgr.create_draft(
            request.get("title", ""),
            request.get("content", "")
        )
        
        if "error" in draft:
            raise HTTPException(status_code=400, detail=draft["error"])
        
        return {
            "draft": draft,
            "hints": draft_mgr.get_refinement_hints(draft),
            "message": "Here's your memory! Review and refine each section."
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating memory draft: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/memories/suggestions")
def get_memory_suggestions(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Get AI suggestions for memory fields"""
    try:
        uid = user.get("uid")
        field = request.get("field", "")
        value = request.get("value", "")
        context = request.get("context", {})
        
        from agents.memory_draft_manager import MemoryDraftManager
        draft_mgr = MemoryDraftManager(uid)
        
        suggestions = draft_mgr.get_field_suggestions(field, value, context)
        
        print(f"💡 Suggestions generated for field: {field}")
        return {"field": field, "suggestions": suggestions}
        
    except Exception as e:
        print(f"❌ Error getting suggestions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/memories")
def create_memory(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Create a new memory"""
    try:
        uid = user.get("uid")
        print(f"💾 Creating memory for user: {uid}")
        
        memory_agent = MemoryAgent(uid)
        
        # Save memory to Firestore
        from firestore.client import FirestoreMemory
        memory_db = FirestoreMemory()
        memory_id = memory_db.save_memory(
            uid,
            title=request.get("title", ""),
            content=request.get("content", ""),
            category=request.get("category", "insight"),
            tags=request.get("tags", [])
        )
        
        print(f"✅ Memory saved with ID: {memory_id}")
        
        return {
            "id": memory_id,
            "title": request.get("title", ""),
            "content": request.get("content", ""),
            "category": request.get("category", "insight"),
            "tags": request.get("tags", []),
            "created_at": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"❌ Error creating memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ PLANS ENDPOINTS ============

@app.post("/api/plans/draft")
def create_draft_plan(
    request: PlanRequest,
    user: dict = Depends(get_current_user)
):
    """Create an initial plan draft for interactive refinement"""
    try:
        uid = user.get("uid")
        print(f"📝 Creating plan draft for user: {uid}")
        
        from agents.draft_manager import DraftManager
        draft_mgr = DraftManager(uid)
        
        draft = draft_mgr.create_draft(request.goal)
        
        if "error" in draft:
            raise HTTPException(status_code=400, detail=draft["error"])
        
        return {
            "draft": draft,
            "hints": draft_mgr.get_refinement_hints(draft),
            "message": "Here's your initial plan! Review and refine each section."
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating draft: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plans/refine")
def refine_plan_draft(
    request: RefineRequest,
    user: dict = Depends(get_current_user)
):
    """Refine a specific field in a plan draft"""
    try:
        uid = user.get("uid")
        print(f"🔄 Refining draft field: {request.field}")
        
        from agents.draft_manager import DraftManager
        draft_mgr = DraftManager(uid)
        
        # Refine the draft
        refined_plan = draft_mgr.refine_draft(
            request.draft_id,
            request.field,
            request.value,
            request.plan_data
        )
        
        # Get suggestions for this field
        suggestions = draft_mgr.get_field_suggestions(
            request.field,
            request.value,
            refined_plan
        )
        
        return {
            "plan": refined_plan,
            "field": request.field,
            "suggestions": suggestions,
            "hints": draft_mgr.get_refinement_hints(refined_plan),
            "message": f"Updated {request.field}. Review suggestions below."
        }
    except Exception as e:
        print(f"❌ Error refining draft: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/plans")
def get_plans(user: dict = Depends(get_current_user)):
    """Retrieve user's plans"""
    try:
        uid = user.get("uid")
        
        from firestore.client import FirestorePlan
        plans_db = FirestorePlan()
        plans = plans_db.get_plans(uid, limit=20)
        
        return {
            "plans": plans,
            "total": len(plans)
        }
    except Exception as e:
        print(f"❌ Error getting plans: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plans")
def create_plan(
    request: PlanRequest,
    user: dict = Depends(get_current_user)
):
    """Create a new plan from a goal"""
    try:
        uid = user.get("uid")
        print(f"📋 Creating plan for user: {uid}")
        
        planning_agent = PlanningAgent(uid)
        plan = planning_agent.create_plan_from_goal(request.goal)
        
        print(f"📋 Plan generated: {plan}")
        
        # Save to Firestore
        from firestore.client import FirestorePlan
        plans_db = FirestorePlan()
        plan_id = plans_db.save_plan(uid, request.goal, plan)
        
        print(f"✅ Plan saved with ID: {plan_id}")
        
        # Return only serializable data
        response_plan = {
            "id": plan_id,
            "goal": plan.get("goal", request.goal),
            "timeframe": plan.get("timeframe", ""),
            "priority": plan.get("priority", "medium"),
            "steps": plan.get("steps", []),
            "potential_challenges": plan.get("potential_challenges", []),
            "resources_needed": plan.get("resources_needed", []),
            "success_metric": plan.get("success_metric", ""),
            "status": "active",
            "created_at": datetime.now().isoformat()
        }
        
        print(f"📋 Returning response: {response_plan}")
        
        # Generate AI follow-up suggestion (non-blocking)
        followup = ""
        try:
            from agents.llm import call_llm
            followup_prompt = f"""Given this goal: {request.goal}

Generate ONE enthusiastic and actionable next step for the user to take immediately.
Keep it to 1-2 sentences. Be specific and encouraging."""
            followup = call_llm(followup_prompt)
            print(f"📋 AI Follow-up: {followup}")
        except Exception as e:
            print(f"⚠️  Couldn't generate follow-up: {e}")
        
        return {
            "plan": response_plan,
            "followUp": followup,
            "suggestedActions": [
                {"id": "track", "label": "Track Progress", "icon": "📊"},
                {"id": "subplan", "label": "Create Sub-Plan", "icon": "➕"},
                {"id": "remind", "label": "Set Reminders", "icon": "🔔"}
            ],
            "created_at": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"❌ Error creating plan: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/plans/{plan_id}")
def get_plan(
    plan_id: str,
    user: dict = Depends(get_current_user)
):
    """Get a specific plan by ID"""
    try:
        uid = user.get("uid")
        print(f"📋 Fetching plan {plan_id} for user {uid}")
        
        from firestore.client import FirestorePlan
        plans_db = FirestorePlan()
        
        plan = plans_db.get_plan_by_id(uid, plan_id)
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        print(f"✅ Plan retrieved: {plan_id}")
        return plan
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ REFLECTIONS ENDPOINTS ============

@app.put("/api/plans/{plan_id}")
def update_plan(
    plan_id: str,
    updates: dict,
    user: dict = Depends(get_current_user)
):
    """Update plan (status, notes, etc.)"""
    try:
        uid = user.get("uid")
        print(f"📋 Updating plan {plan_id} for user {uid}: {updates}")
        
        from firestore.client import FirestorePlan
        plans_db = FirestorePlan()
        
        # Update the plan
        plans_db.update_plan(uid, plan_id, updates)
        
        print(f"✅ Plan {plan_id} updated successfully")
        return {"id": plan_id, "updated": True, "updates": updates}
    except Exception as e:
        print(f"❌ Error updating plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/plans/{plan_id}")
def delete_plan(
    plan_id: str,
    user: dict = Depends(get_current_user)
):
    """Delete a plan"""
    try:
        uid = user.get("uid")
        print(f"📋 Deleting plan {plan_id} for user {uid}")
        
        from firestore.client import FirestorePlan
        plans_db = FirestorePlan()
        
        # Delete the plan
        plans_db.delete_plan(uid, plan_id)
        
        print(f"✅ Plan {plan_id} deleted successfully")
        return {"id": plan_id, "deleted": True}
    except Exception as e:
        print(f"❌ Error deleting plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/plans/suggestions")
def get_plan_suggestions(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Get AI suggestions for plan fields"""
    try:
        uid = user.get("uid")
        field = request.get("field", "")
        current_value = request.get("currentValue", "")
        context = request.get("context", {})
        
        print(f"💡 Getting suggestions for field '{field}'")
        
        from agents.llm import call_llm
        
        prompts = {
            "goal": f"""User is refining their goal. Current goal: {current_value}
            
Generate 3 better, more specific goal statements. Each should be clear and actionable.
Return as JSON: ["goal 1", "goal 2", "goal 3"]""",
            
            "timeframe": f"""User's goal: {context.get('goal', '')}
Current timeframe estimate: {current_value}

Suggest 3 realistic timeframe options. Consider complexity.
Return as JSON: ["timeframe 1", "timeframe 2", "timeframe 3"]""",
            
            "priority": f"""Suggest priority level (high/medium/low) for: {context.get('goal', '')}
Reasoning: {context.get('complexity', '')}
Return as JSON: {{"priority": "high", "reasoning": "..."}}""",
            
            "steps": f"""Goal: {context.get('goal', '')}
Timeframe: {context.get('timeframe', '')}

Suggest 3 different step breakdowns (each is a complete list of steps).
Return as JSON: [[step1, step2, step3], [...], [...]]"""
        }
        
        prompt = prompts.get(field, f"Generate suggestions for {field}")
        suggestions = call_llm(prompt)
        
        try:
            suggestions_json = json.loads(suggestions)
        except:
            suggestions_json = {"error": "Could not parse suggestions"}
        
        print(f"💡 Suggestions generated")
        return {"field": field, "suggestions": suggestions_json}
        
    except Exception as e:
        print(f"❌ Error getting suggestions: {e}")
        raise HTTPException(status_code=500, detail=str(e))





@app.get("/api/reflections")
def get_reflections(user: dict = Depends(get_current_user)):
    """Retrieve user's reflections"""
    try:
        uid = user.get("uid")
        
        from firestore.client import FirestoreReflection
        reflections_db = FirestoreReflection()
        reflections = reflections_db.get_reflections(uid, limit=20)
        
        # Format for frontend
        formatted = []
        for r in reflections:
            formatted.append({
                "id": r.get("id", ""),
                "title": r.get("title", "Reflection"),
                "content": r.get("content", ""),
                "type": r.get("type", "daily"),
                "insights": r.get("analysis", {}).get("key_insights", []),
                "next_actions": r.get("analysis", {}).get("next_actions", []),
                "created_at": r.get("createdAt", datetime.now()).isoformat() if isinstance(r.get("createdAt"), datetime) else str(r.get("createdAt", ""))
            })
        
        return {
            "reflections": formatted,
            "total": len(formatted)
        }
    except Exception as e:
        print(f"❌ Error getting reflections: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reflections/draft")
def create_reflection_draft(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Create an initial reflection draft for interactive refinement"""
    try:
        uid = user.get("uid")
        print(f"📝 Creating reflection draft for user: {uid}")
        
        from agents.reflection_draft_manager import ReflectionDraftManager
        draft_mgr = ReflectionDraftManager(uid)
        
        draft = draft_mgr.create_draft(
            request.get("title", ""),
            request.get("content", "")
        )
        
        if "error" in draft:
            raise HTTPException(status_code=400, detail=draft["error"])
        
        return {
            "draft": draft,
            "hints": draft_mgr.get_refinement_hints(draft),
            "message": "Here's your reflection! Review and refine the insights and actions."
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating reflection draft: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reflections/suggestions")
def get_reflection_suggestions(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Get AI suggestions for reflection fields"""
    try:
        uid = user.get("uid")
        field = request.get("field", "")
        value = request.get("value", "")
        context = request.get("context", {})
        
        from agents.reflection_draft_manager import ReflectionDraftManager
        draft_mgr = ReflectionDraftManager(uid)
        
        suggestions = draft_mgr.get_field_suggestions(field, value, context)
        
        print(f"💡 Suggestions generated for field: {field}")
        return {"field": field, "suggestions": suggestions}
        
    except Exception as e:
        print(f"❌ Error getting suggestions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reflections")
def create_reflection(
    request: dict,
    user: dict = Depends(get_current_user)
):
    """Create a new reflection"""
    try:
        uid = user.get("uid")
        print(f"💭 Creating reflection for user: {uid}")
        
        # Save to Firestore
        from firestore.client import FirestoreReflection
        reflections_db = FirestoreReflection()
        reflection_id = reflections_db.save_reflection(
            uid,
            title=request.get("title", "Reflection"),
            content=request.get("content", ""),
            type=request.get("type", "daily"),
            analysis={
                "key_insights": request.get("insights", []),
                "next_actions": request.get("next_actions", [])
            }
        )
        
        print(f"✅ Reflection saved with ID: {reflection_id}")
        
        return {
            "id": reflection_id,
            "title": request.get("title", "Reflection"),
            "content": request.get("content", ""),
            "type": request.get("type", "daily"),
            "insights": request.get("insights", []),
            "next_actions": request.get("next_actions", []),
            "created_at": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"❌ Error creating reflection: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
