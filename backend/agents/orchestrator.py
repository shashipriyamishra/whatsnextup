from agents.llm import call_llm
from agents.memory_agent import MemoryAgent
from agents.planning_agent import PlanningAgent
from memory.store import save_memory
from vector_memory.store import search_similar


def detect_intent(message: str) -> str:
    """
    Detect user intent from message.
    Returns: 'memory', 'planning', 'reflection', 'chat'
    """
    message_lower = message.lower()
    
    # Planning intent keywords
    planning_keywords = ["plan", "goal", "should", "help me", "how to", "steps", "break down", 
                         "organize", "prioritize", "next", "deadline", "schedule"]
    
    # Memory intent keywords
    memory_keywords = ["remember", "forgot", "remind me", "note", "save", "memo", "memory"]
    
    # Reflection intent keywords
    reflection_keywords = ["reflect", "think about", "what did i", "how did", "why did", "lesson", "insight"]
    
    # Check for planning
    if any(keyword in message_lower for keyword in planning_keywords):
        return "planning"
    
    # Check for memory
    if any(keyword in message_lower for keyword in memory_keywords):
        return "memory"
    
    # Check for reflection
    if any(keyword in message_lower for keyword in reflection_keywords):
        return "reflection"
    
    return "chat"


def handle_user_message(message: str, user_id: str) -> str:
    """
    Route message to appropriate agent based on intent.
    Supports: memory, planning, reflection, and general chat.
    """
    try:
        # Detect intent
        intent = detect_intent(message)
        
        # Initialize agents
        memory_agent = MemoryAgent(user_id)
        planning_agent = PlanningAgent(user_id)
        
        # Get relevant context for all agents
        relevant_memories = search_similar(message, k=5)
        context = {
            "relevant_memories": relevant_memories,
            "user_preferences": {}  # Will be populated from Firestore in future
        }
        
        # Route based on intent
        if intent == "planning":
            # Extract goal/task from message
            goal = message.replace("plan", "").replace("how to", "").strip()
            plan = planning_agent.create_plan_from_goal(goal, context)
            
            if "error" in plan:
                response = f"I had trouble creating a plan. Let me help differently: {plan['error']}"
            else:
                response = format_plan_response(plan)
        
        elif intent == "memory":
            # Save to memory with categorization
            try:
                memory_agent.save_with_context(message)
                response = "✓ Saved to memory. I'll remember this."
            except Exception as e:
                print(f"Error saving memory: {e}")
                response = "I'll remember this for next time."
        
        elif intent == "reflection":
            # Trigger reflection analysis
            response = planning_agent.suggest_next_actions(
                f"User is reflecting: {message}",
                context
            )
            response_text = f"Here are some insights: {', '.join(response)}"
            return response_text
        
        else:
            # General chat - use full context
            context_text = "\n".join(relevant_memories) if relevant_memories else ""
            
            prompt = f"""You are whatsnextup AI - a personal operating system that helps users think, remember, and decide.

Your role:
- Help users decide what to do next
- Be practical, calm, and supportive
- Adapt tone based on user needs
- Reference user's past decisions when relevant

IMPORTANT: Provide COMPLETE responses. Do not truncate or cut off mid-thought.

Relevant context from user's memory:
{context_text}

User message:
{message}

Respond with:
1. Direct answer to their question
2. Key insight or perspective
3. One actionable suggestion

Be thorough but organized."""
            response = call_llm(prompt)
        
        # Save this interaction to memory
        save_memory(message)
        
        return response
    
    except Exception as e:
        print(f"❌ Orchestrator error: {e}")
        return f"I encountered an issue. Please try again. ({str(e)})"


def format_plan_response(plan: dict) -> str:
    """Format plan object into readable response"""
    if not plan:
        return "I couldn't create a plan."
    
    response = f"📋 Plan: {plan.get('goal', 'No goal')}\n"
    response += f"⏱️ Timeframe: {plan.get('timeframe', 'TBD')}\n"
    response += f"🎯 Priority: {plan.get('priority', 'Medium')}\n\n"
    
    steps = plan.get('steps', [])
    if steps:
        response += "Steps:\n"
        for step in steps[:5]:  # Show first 5 steps
            response += f"  {step.get('step', '?')}. {step.get('action', 'No action')} ({step.get('deadline', 'TBD')})\n"
    
    return response
