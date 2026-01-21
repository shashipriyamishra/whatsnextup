# backend/firestore/client.py

import os
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Optional, Dict, Any, List
from datetime import datetime

# Initialize Firebase Admin SDK
def init_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin.get_app():
        # Use default credentials (set via GOOGLE_APPLICATION_CREDENTIALS env var)
        try:
            firebase_admin.initialize_app()
            print("✅ Firebase Admin SDK initialized")
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            raise

# Get Firestore client
def get_firestore_client():
    """Get Firestore client instance"""
    try:
        return firestore.client()
    except Exception as e:
        print(f"❌ Failed to get Firestore client: {e}")
        raise

# Initialize on import - will be called from main.py
db = None

try:
    # Check if already initialized
    if firebase_admin._apps:
        db = get_firestore_client()
except Exception as e:
    pass  # Will initialize when called from main.py


class FirestoreUser:
    """User data operations"""
    
    @staticmethod
    def get_or_create(user_id: str, email: str, display_name: str) -> Dict:
        """Get or create user document"""
        try:
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
            docs = (db.collection("users").document(user_id).collection("memories")
                   .where("category", "==", category)
                   .order_by("createdAt", direction=firestore.Query.DESCENDING)
                   .limit(limit)
                   .stream())
            
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"❌ Error getting memories by category: {e}")
            return []


class FirestoreChat:
    """Chat history storage"""
    
    @staticmethod
    def save_message(user_id: str, role: str, message: str, embeddings: List[float] = None) -> str:
        """Save chat message"""
        try:
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
    def save_reflection(user_id: str, reflection_type: str, content: str, insights: List[str] = None) -> str:
        """Save a reflection"""
        try:
            reflection_data = {
                "type": reflection_type,  # daily, weekly, monthly
                "content": content,
                "insights": insights or [],
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
            docs = (db.collection("users").document(user_id).collection("reflections")
                   .order_by("createdAt", direction=firestore.Query.DESCENDING)
                   .limit(limit)
                   .stream())
            
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"❌ Error getting reflections: {e}")
            return []
