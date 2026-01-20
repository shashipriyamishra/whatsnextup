import uuid

# In-memory store (safe for now)
PENDING_ACTIONS = {}


def create_pending_action(message: str):
    action_id = str(uuid.uuid4())
    PENDING_ACTIONS[action_id] = message
    return action_id


def get_pending_action(action_id: str):
    return PENDING_ACTIONS.get(action_id)


def remove_pending_action(action_id: str):
    if action_id in PENDING_ACTIONS:
        del PENDING_ACTIONS[action_id]
