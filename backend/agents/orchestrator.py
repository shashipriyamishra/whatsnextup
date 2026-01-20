from agents.llm import call_llm
from memory.store import save_memory
from vector_memory.store import search_similar


def handle_user_message(message: str) -> str:
    # Save raw memory
    save_memory(message)

    # Get relevant past context
    relevant_context = search_similar(message)

    context_text = "\n".join(relevant_context)

    prompt = f"""
You are whatsnextup AI.

Your role:
- Help users decide what to do next
- Be practical, calm, and supportive
- Adapt tone based on user mood

Relevant past context:
{context_text}

User message:
{message}

Respond helpfully.
"""

    return call_llm(prompt)
