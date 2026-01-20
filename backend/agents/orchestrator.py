from agents.llm import call_llm
from agents.planner import decide_intent
from agents.executor import request_confirmation, execute_confirmed_action
from agents.pending_actions import get_pending_action, remove_pending_action
from memory.store import save_memory
from vector_memory.simple_store import add_document, search_similar


def handle_user_message(message: str) -> str:
    message_upper = message.upper()

    # HANDLE CONFIRMATION
    if message_upper.startswith("CONFIRM"):
        action_id = message.split(" ", 1)[1]
        action = get_pending_action(action_id)

        if not action:
            return "No pending action found for confirmation."

        remove_pending_action(action_id)
        return execute_confirmed_action(action)

    if message_upper.startswith("CANCEL"):
        action_id = message.split(" ", 1)[1]
        remove_pending_action(action_id)
        return "[CANCELLED] Action has been cancelled."

    # NORMAL FLOW
    intent = decide_intent(message)

    save_memory(message)
    add_document(message)

    if intent == "action":
        return request_confirmation(message)

    if intent == "reflection":
        relevant_context = search_similar(message)
    else:
        relevant_context = []

    context_text = "\n".join(relevant_context)

    prompt = f"""
You are whatsnextup AI.

User intent: {intent}

Relevant past context:
{context_text}

User says:
{message}
"""

    return call_llm(prompt)
