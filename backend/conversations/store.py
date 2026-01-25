# Conversation Storage
from firestore.client import db
from datetime import datetime
from typing import List, Optional, Dict, Any
from google.cloud.firestore_v1 import FieldFilter

def save_conversation_message_sync(
    user_id: str,
    agent_id: str,
    message: str,
    response: str,
    metadata: Optional[Dict[str, Any]] = None
) -> str:
    """Save a conversation message to Firestore (synchronous version)"""
    try:
        conversation_data = {
            "user_id": user_id,
            "agent_id": agent_id,
            "user_message": message,
            "agent_response": response,
            "timestamp": datetime.utcnow(),
            "metadata": metadata or {}
        }
        
        doc_ref = db.collection("conversations").document()
        doc_ref.set(conversation_data)
        
        return doc_ref.id
    except Exception as e:
        print(f"❌ Error saving conversation: {e}")
        raise

async def save_conversation_message(
    user_id: str,
    agent_id: str,
    message: str,
    response: str,
    metadata: Optional[Dict[str, Any]] = None
) -> str:
    """Save a conversation message to Firestore"""
    try:
        conversation_data = {
            "user_id": user_id,
            "agent_id": agent_id,
            "user_message": message,
            "agent_response": response,
            "timestamp": datetime.utcnow(),
            "metadata": metadata or {}
        }
        
        doc_ref = db.collection("conversations").document()
        doc_ref.set(conversation_data)
        
        return doc_ref.id
    except Exception as e:
        print(f"❌ Error saving conversation: {e}")
        raise

async def get_conversation_history(
    user_id: str,
    agent_id: Optional[str] = None,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """Get conversation history for a user"""
    try:
        print(f"🔍 Fetching conversations for user_id: {user_id}, agent_id: {agent_id}")
        
        try:
            # Try the optimized query first
            query = db.collection("conversations").where(
                filter=FieldFilter("user_id", "==", user_id)
            )
            
            if agent_id:
                query = query.where(filter=FieldFilter("agent_id", "==", agent_id))
            
            query = query.order_by("timestamp", direction="DESCENDING").limit(limit)
            docs = list(query.stream())
            
        except Exception as e:
            print(f"⚠️  Optimized query failed: {e}")
            print("   Attempting fallback query without ordering...")
            
            # Fallback: Simple query without order_by (no composite index needed)
            query = db.collection("conversations").where(
                filter=FieldFilter("user_id", "==", user_id)
            )
            
            if agent_id:
                query = query.where(filter=FieldFilter("agent_id", "==", agent_id))
            
            docs = list(query.stream())
            
            # Sort in-memory
            docs.sort(key=lambda d: d.get("timestamp", 0), reverse=True)
            docs = docs[:limit]
        
        conversations = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            conversations.append(data)
        
        print(f"✅ Found {len(conversations)} conversations for user {user_id}")
        return conversations
    except Exception as e:
        print(f"❌ Error fetching conversation history: {e}")
        print(f"   Error details: {str(e)}")
        return []

async def search_conversations(
    user_id: str,
    search_query: str,
    limit: int = 20
) -> List[Dict[str, Any]]:
    """Search conversations by text"""
    try:
        # Get all conversations for user
        query = db.collection("conversations").where(
            filter=FieldFilter("user_id", "==", user_id)
        ).order_by("timestamp", direction="DESCENDING").limit(100)
        
        docs = query.stream()
        conversations = []
        search_lower = search_query.lower()
        
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            
            # Simple text search in message and response
            if (search_lower in data.get("user_message", "").lower() or 
                search_lower in data.get("agent_response", "").lower()):
                conversations.append(data)
                if len(conversations) >= limit:
                    break
        
        return conversations
    except Exception as e:
        print(f"❌ Error searching conversations: {e}")
        return []

async def delete_conversation(user_id: str, conversation_id: str) -> bool:
    """Delete a specific conversation"""
    try:
        doc_ref = db.collection("conversations").document(conversation_id)
        doc = doc_ref.get()
        
        if doc.exists and doc.to_dict().get("user_id") == user_id:
            doc_ref.delete()
            return True
        return False
    except Exception as e:
        print(f"❌ Error deleting conversation: {e}")
        return False

async def get_conversation_stats(user_id: str) -> Dict[str, Any]:
    """Get conversation statistics for a user"""
    try:
        query = db.collection("conversations").where(
            filter=FieldFilter("user_id", "==", user_id)
        )
        
        docs = list(query.stream())
        
        total_conversations = len(docs)
        total_messages = 0
        agents_used = set()
        
        for doc in docs:
            data = doc.to_dict()
            agents_used.add(data.get("agent_id"))
            # Count both user and agent messages
            total_messages += 2  # Assuming each conversation has 1 user + 1 agent message
        
        return {
            "total_conversations": total_conversations,
            "total_messages": total_messages,
            "agents_used": list(agents_used)
        }
    except Exception as e:
        print(f"❌ Error getting conversation stats: {e}")
        return {"total_conversations": 0, "total_messages": 0, "agents_used": []}

# Aliases for endpoint compatibility
get_conversations = get_conversation_history
search_conversations_fn = search_conversations
delete_conversation_fn = delete_conversation
