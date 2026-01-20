def decide_intent(message: str) -> str:
    message_lower = message.lower()

    if any(word in message_lower for word in ["remind", "schedule", "notify"]):
        return "action"

    if any(word in message_lower for word in ["plan", "today", "next", "steps"]):
        return "planning"

    if any(word in message_lower for word in ["feel", "stressed", "happy", "sad", "confused"]):
        return "reflection"

    return "chat"
