# backend/firestore/client.py

import os
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Optional, Dict, Any, List
from datetime import datetime

# Global Firestore client instance
db = None

# Initialize Firebase Admin SDK
def init_firebase():
    """Initialize Firebase Admin SDK"""
    global db
    
    if not firebase_admin._apps:
        try:
            # On Cloud Run, use Application Default Credentials
            # Locally, set GOOGLE_APPLICATION_CREDENTIALS to your service account key
            firebase_admin.initialize_app()
            print("✅ Firebase Admin SDK initialized")
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            # Don't raise - allow app to continue
            return None
    
    # Always ensure db is set after initialization
    try:
        db = firestore.client()
        print("✅ Firestore client connected")
        return db
    except Exception as e:
        print(f"❌ Failed to get Firestore client: {e}")
        # Don't raise - allow app to continue
        return None

# Get Firestore client
def get_firestore_client():
    """Get Firestore client instance"""
    global db
    
    if db is None:
        try:
            # Ensure Firebase is initialized first
            if not firebase_admin._apps:
                firebase_admin.initialize_app()
                print("✅ Firebase Admin SDK auto-initialized in get_firestore_client")
            
            db = firestore.client()
            print("✅ Firestore client retrieved")
        except Exception as e:
            print(f"❌ Failed to get Firestore client: {e}")
            # Don't raise - return None to allow app to start
            return None
    
    return db


class FirestoreUser:
    """User data operations"""
    
    @staticmethod
    def get_or_create(user_id: str, email: str, display_name: str) -> Dict:
        """Get or create user document"""
        try:
            db = get_firestore_client()
            user_ref = db.collection("users").document(user_id)
            user_doc = user_ref.get()
            
            if user_doc.exists:
                return user_doc.to_dict()
            
            # Create new user
            user_data = {
                "email": email,
                "displayName": display_name,
                "createdAt": datetime.utcnow(),
                "preferences": {
                    "timezone": "UTC",
                    "reminderFrequency": "daily",
                    "reflectionTime": "20:00"
                }
            }
            user_ref.set(user_data)
            print(f"✅ User created: {user_id}")
            return user_data
        except Exception as e:
            print(f"❌ Error in get_or_create: {e}")
            raise

    @staticmethod
    def get_preferences(user_id: str) -> Dict:
        """Get user preferences"""
        try:
            db = get_firestore_client()
            user_doc = db.collection("users").document(user_id).get()
            if user_doc.exists:
                data = user_doc.to_dict()
                return data.get("preferences", {})
            return {}
        except Exception as e:
            print(f"❌ Error getting preferences: {e}")
            return {}

    @staticmethod
    def update_preferences(user_id: str, preferences: Dict) -> bool:
        """Update user preferences"""
        try:
            db = get_firestore_client()
            db.collection("users").document(user_id).update({
                "preferences": preferences
            })
            return True
        except Exception as e:
            print(f"❌ Error updating preferences: {e}")
            return False


class FirestoreMemory:
    """Memory (conversations) storage"""
    
    @staticmethod
    def save_memory(user_id: str, content: str, category: str = "chat", tags: List[str] = None) -> str:
        """Save a memory/message"""
        try:
            db = get_firestore_client()
            memory_data = {
                "content": content,
                "category": category,  # chat, habit, goal, fact, preference
                "tags": tags or [],
                "createdAt": datetime.utcnow(),
                "relevanceScore": 1.0
            }
            
            doc_ref = db.collection("users").document(user_id).collection("memories").add(memory_data)
            return doc_ref[1].id
        except Exception as e:
            print(f"❌ Error saving memory: {e}")
            raise

    @staticmethod
    def get_recent_memories(user_id: str, limit: int = 10) -> List[Dict]:
        """Get recent memories for user"""
        try:
            db = get_firestore_client()
            docs = (db.collection("users").document(user_id).collection("memories")
                   .order_by("createdAt", direction=firestore.Query.DESCENDING)
                   .limit(limit)
                   .stream())
            
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"❌ Error getting memories: {e}")
            return []

    @staticmethod
    def get_memories_by_category(user_id: str, category: str, limit: int = 10) -> List[Dict]:
        """Get memories by category"""
        try:
            db = get_firestore_client()
            if db is None:
                print("⚠️  Firestore not available, returning empty list")
                return []
            
            print(f"🧠 Querying memories for user: {user_id}, category: {category}")
            
            docs = (db.collection("users").document(user_id).collection("memories")
                   .where("category", "==", category)
                   .order_by("createdAt", direction=firestore.Query.DESCENDING)
                   .limit(limit)
                   .stream())
            
            result = [doc.to_dict() for doc in docs]
            print(f"🧠 Found {len(result)} memories for category {category}")
            return result
        except Exception as e:
            print(f"❌ Error getting memories by category: {e}")
            return []


class FirestoreChat:
    """Chat history storage"""
    
    @staticmethod
    def save_message(user_id: str, role: str, message: str, embeddings: List[float] = None) -> str:
        """Save chat message"""
        try:
            db = get_firestore_client()
            chat_data = {
                "role": role,  # user or ai
                "message": message,
                "timestamp": datetime.utcnow(),
                "embeddings": embeddings or []
            }
            
            doc_ref = db.collection("users").document(user_id).collection("chats").add(chat_data)
            return doc_ref[1].id
        except Exception as e:
            print(f"❌ Error saving message: {e}")
            raise

    @staticmethod
    def get_chat_history(user_id: str, limit: int = 50) -> List[Dict]:
        """Get chat history for user"""
        try:
            db = get_firestore_client()
            docs = (db.collection("users").document(user_id).collection("chats")
                   .order_by("timestamp", direction=firestore.Query.DESCENDING)
                   .limit(limit)
                   .stream())
            
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"❌ Error getting chat history: {e}")
            return []


class FirestoreTask:
    """Task/Reminder storage"""
    
    @staticmethod
    def create_task(user_id: str, title: str, description: str, due_date: str = None) -> str:
        """Create a task"""
        try:
            db = get_firestore_client()
            task_data = {
                "title": title,
                "description": description,
                "dueDate": due_date,
                "completed": False,
                "createdAt": datetime.utcnow()
            }
            
            doc_ref = db.collection("users").document(user_id).collection("tasks").add(task_data)
            return doc_ref[1].id
        except Exception as e:
            print(f"❌ Error creating task: {e}")
            raise

    @staticmethod
    def get_tasks(user_id: str, completed: bool = False) -> List[Dict]:
        """Get tasks for user"""
        try:
            db = get_firestore_client()
            docs = (db.collection("users").document(user_id).collection("tasks")
                   .where("completed", "==", completed)
                   .order_by("dueDate")
                   .stream())
            
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"❌ Error getting tasks: {e}")
            return []

    @staticmethod
    def mark_completed(user_id: str, task_id: str) -> bool:
        """Mark task as completed"""
        try:
            db = get_firestore_client()
            db.collection("users").document(user_id).collection("tasks").document(task_id).update({
                "completed": True,
                "completedAt": datetime.utcnow()
            })
            return True
        except Exception as e:
            print(f"❌ Error marking task complete: {e}")
            return False


class FirestoreReflection:
    """Daily/Weekly reflection storage"""
    
    @staticmethod
    def save_reflection(user_id: str, title: str, content: str, analysis: Dict = None, mood: str = "thoughtful") -> str:
        """Save a reflection"""
        try:
            db = get_firestore_client()
            reflection_data = {
                "title": title,
                "content": content,
                "analysis": analysis or {},
                "mood": mood,
                "createdAt": datetime.utcnow()
            }
            
            doc_ref = db.collection("users").document(user_id).collection("reflections").add(reflection_data)
            return doc_ref[1].id
        except Exception as e:
            print(f"❌ Error saving reflection: {e}")
            raise

    @staticmethod
    def get_reflections(user_id: str, limit: int = 10) -> List[Dict]:
        """Get reflections for user"""
        try:
            db = get_firestore_client()
            docs = (db.collection("users").document(user_id).collection("reflections")
                   .order_by("createdAt", direction=firestore.Query.DESCENDING)
                   .limit(limit)
                   .stream())
            
            results = []
            for doc in docs:
                data = doc.to_dict()
                data['id'] = doc.id
                results.append(data)
            return results
        except Exception as e:
            print(f"❌ Error getting reflections: {e}")
            return []


class FirestorePlan:
    """Plans storage"""
    
    @staticmethod
    @staticmethod
    def save_plan(user_id: str, goal: str, plan_data: Dict) -> str:
        """Save a plan"""
        try:
            print(f"📝 Attempting to save plan for user: {user_id}")
            db = get_firestore_client()
            
            if db is None:
                print("❌ Firestore client is None!")
                raise Exception("Firestore not available")
            
            plan_document = {
                "goal": goal,
                "timeframe": plan_data.get("timeframe", ""),
                "priority": plan_data.get("priority", "medium"),
                "steps": plan_data.get("steps", []),
                "potential_challenges": plan_data.get("potential_challenges", []),
                "resources_needed": plan_data.get("resources_needed", []),
                "success_metric": plan_data.get("success_metric", ""),
                "status": "active",
                "createdAt": datetime.utcnow()
            }
            
            print(f"📝 Plan document: {plan_document}")
            result = db.collection("users").document(user_id).collection("plans").add(plan_document)
            print(f"📝 Add result type: {type(result)}, value: {result}")
            
            # result is a tuple (write_time, doc_ref) 
            # We need the doc_ref.id
            if result and len(result) > 1:
                doc_ref = result[1]
                plan_id = doc_ref.id
                print(f"✅ Plan saved successfully with ID: {plan_id}")
                return plan_id
            else:
                print(f"⚠️ Unexpected result format: {result}")
                raise Exception(f"Unexpected result from Firestore add: {result}")
                
        except Exception as e:
            print(f"❌ Error saving plan: {e}")
            import traceback
            traceback.print_exc()
            raise

    @staticmethod
    def get_plans(user_id: str, status: str = None, limit: int = 20) -> List[Dict]:
        """Get plans for user"""
        try:
            db = get_firestore_client()
            print(f"🔍 Getting plans for user_id: {user_id}")
            query = db.collection("users").document(user_id).collection("plans")
            
            if status:
                print(f"🔍 Filtering by status: {status}")
                query = query.where("status", "==", status)
            
            print(f"🔍 Executing query with order_by createdAt DESC, limit {limit}")
            docs = query.order_by("createdAt", direction=firestore.Query.DESCENDING).limit(limit).stream()
            
            results = []
            for doc in docs:
                print(f"✅ Found plan document: {doc.id}")
                data = doc.to_dict()
                data['id'] = doc.id
                results.append(data)
            print(f"📊 Total plans found: {len(results)}")
            return results
        except Exception as e:
            print(f"❌ Error getting plans: {e}")
            import traceback
            traceback.print_exc()
            return []

    @staticmethod
    def update_plan_status(user_id: str, plan_id: str, status: str) -> bool:
        """Update plan status"""
        try:
            db = get_firestore_client()
            db.collection("users").document(user_id).collection("plans").document(plan_id).update({
                "status": status,
                "updatedAt": datetime.utcnow()
            })
            return True
        except Exception as e:
            print(f"❌ Error updating plan status: {e}")
            return False

    @staticmethod
    def update_plan(user_id: str, plan_id: str, updates: Dict) -> bool:
        """Update plan with custom updates"""
        try:
            db = get_firestore_client()
            updates["updatedAt"] = datetime.utcnow()
            db.collection("users").document(user_id).collection("plans").document(plan_id).update(updates)
            print(f"✅ Plan {plan_id} updated")
            return True
        except Exception as e:
            print(f"❌ Error updating plan: {e}")
            return False

    @staticmethod
    def delete_plan(user_id: str, plan_id: str) -> bool:
        """Delete a plan"""
        try:
            db = get_firestore_client()
            db.collection("users").document(user_id).collection("plans").document(plan_id).delete()
            print(f"✅ Plan {plan_id} deleted")
            return True
        except Exception as e:
            print(f"❌ Error deleting plan: {e}")
            return False

    @staticmethod
    def get_plan_by_id(user_id: str, plan_id: str) -> Dict:
        """Get a specific plan by ID"""
        try:
            db = get_firestore_client()
            doc = db.collection("users").document(user_id).collection("plans").document(plan_id).get()
            if doc.exists:
                data = doc.to_dict()
                data['id'] = doc.id
                return data
            return None
        except Exception as e:
            print(f"❌ Error getting plan: {e}")
            return None
