# backend/agents/memory_agent.py

from firestore.client import FirestoreMemory, FirestoreUser
from vector_memory.store import embed_text, search_similar, add_document
from typing import List, Dict, Any
from datetime import datetime
from agents.llm import call_llm

class MemoryAgent:
    """
    Manages user memory with categorization and retrieval.
    
    Categories:
    - chat: General conversations
    - habit: User habits ("I usually work 9-5", "I exercise at 6am")
    - goal: User goals and aspirations
    - fact: Important facts about user
    - preference: User preferences
    - decision: Important decisions made
    - insight: Key insights and learnings
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.memory_db = FirestoreMemory()
        self.user_db = FirestoreUser()
    
    def analyze_and_categorize(self, text: str, use_ai: bool = True) -> str:
        """
        Categorize incoming message using both heuristics and AI.
        Falls back to heuristics if AI fails.
        """
        # Try AI categorization first
        if use_ai:
            try:
                prompt = f"""Categorize this memory into ONE category only.
Categories: habit, goal, fact, preference, decision, insight, chat

Memory: {text[:200]}

Respond with ONLY the category name."""
                category = call_llm(prompt).strip().lower()
                valid_categories = ["habit", "goal", "fact", "preference", "decision", "insight", "chat"]
                if category in valid_categories:
                    print(f"🧠 AI categorized as: {category}")
                    return category
            except Exception as e:
                print(f"⚠️  AI categorization failed, using heuristics: {e}")
        
        # Fallback to heuristics
        text_lower = text.lower()
        
        # Insight patterns
        if any(word in text_lower for word in ["learned", "discovered", "realized", "understand", "noticed", "insight", "key takeaway"]):
            return "insight"
        
        # Habit patterns
        if any(word in text_lower for word in ["usually", "always", "everyday", "every day", "morning", "evening", "routine", "habit"]):
            return "habit"
        
        # Goal patterns
        if any(word in text_lower for word in ["goal", "want to", "want", "aim", "target", "achieve", "accomplish", "learn", "build"]):
            return "goal"
        
        # Preference patterns
        if any(word in text_lower for word in ["prefer", "like", "love", "hate", "dislike", "favorite", "favourite", "enjoy"]):
            return "preference"
        
        # Decision patterns
        if any(word in text_lower for word in ["decided", "choice", "chose", "picked", "selected", "decided to", "going to"]):
            return "decision"
        
        # Fact patterns
        if any(word in text_lower for word in ["i am", "i'm", "my name", "age", "work", "live", "from", "located", "years old"]):
            return "fact"
        
        return "chat"
    
    def save_with_context(self, message: str, category: str = None, tags: List[str] = None, metadata: Dict = None) -> Dict[str, Any]:
        """
        Save memory with automatic categorization and embedding.
        """
        try:
            # Auto-categorize if not provided
            if category is None:
                category = self.analyze_and_categorize(message)
            
            # Save to Firestore using the correct format
            from firestore.client import FirestoreMemory
            memory_db = FirestoreMemory()
            memory_id = memory_db.save_memory(
                user_id=self.user_id,
                title="",
                content=message,
                category=category,
                tags=tags or []
            )
            
            # Add to vector store for semantic search
            try:
                add_document(message)
            except:
                pass  # Vector store optional
            
            print(f"✅ Memory saved: {memory_id} (category: {category})")
            
            return {
                "id": memory_id,
                "category": category,
                "saved": True
            }
        except Exception as e:
            print(f"❌ Error saving memory: {e}")
            return {"saved": False, "error": str(e)}
    
    def get_relevant_context(self, query: str, k: int = 5) -> Dict[str, Any]:
        """
        Retrieve relevant memories for a query using semantic search.
        Returns categorized context.
        """
        try:
            # Search similar memories from vector store
            similar_memories = search_similar(query, k=k)
            
            # Get user preferences for context
            user_prefs = self.user_db.get_preferences(self.user_id)
            
            context = {
                "relevant_memories": similar_memories,
                "user_preferences": user_prefs,
                "recent_chat": self.memory_db.get_recent_memories(self.user_id, limit=3)
            }
            
            return context
        except Exception as e:
            print(f"❌ Error getting context: {e}")
            return {"error": str(e)}
    
    def get_memories_by_type(self, category: str, limit: int = 10) -> List[Dict]:
        """
        Get memories of specific category.
        """
        try:
            return self.memory_db.get_memories_by_category(
                user_id=self.user_id,
                category=category,
                limit=limit
            )
        except Exception as e:
            print(f"❌ Error getting memories: {e}")
            return []
    
    def get_memory_summary(self) -> Dict[str, Any]:
        """
        Get summary of all user memories by category.
        """
        try:
            categories = ["habit", "goal", "fact", "preference", "decision", "chat"]
            all_memories = []
            summary_by_category = {}
            
            print(f"🧠 Getting memories for user: {self.user_id}")
            
            for category in categories:
                memories = self.get_memories_by_type(category, limit=10)
                print(f"🧠 Category '{category}': {len(memories)} memories")
                summary_by_category[category] = len(memories)
                
                # Format memories for response
                for mem in memories:
                    all_memories.append({
                        "id": mem.get("id", ""),
                        "text": mem.get("content", ""),
                        "category": category,
                        "created_at": mem.get("createdAt", datetime.now()).isoformat() if isinstance(mem.get("createdAt"), datetime) else str(mem.get("createdAt", ""))
                    })
            
            print(f"📊 Total memories found: {len(all_memories)}")
            return {
                "memories": all_memories,
                "total": len(all_memories),
                "by_category": summary_by_category
            }
        except Exception as e:
            print(f"❌ Error getting summary: {e}")
            return {
                "memories": [],
                "total": 0,
                "by_category": {},
                "error": str(e)
            }
    
    def extract_insights(self, memories: List[Dict]) -> List[str]:
        """
        Extract key insights from memories.
        Could be enhanced with LLM analysis.
        """
        insights = []
        
        # Basic insights extraction
        for memory in memories:
            content = memory.get("content", "")
            category = memory.get("category", "")
            
            if category == "goal":
                insights.append(f"Goal identified: {content}")
            elif category == "habit":
                insights.append(f"Habit: {content}")
            elif category == "preference":
                insights.append(f"Preference: {content}")
        
        return insights
