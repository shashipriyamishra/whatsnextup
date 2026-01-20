from agents.pending_actions import create_pending_action
from agents.background_tasks import run_after_delay
from datetime import datetime, timedelta
from tasks.store import create_task

def request_confirmation(message: str) -> str:
    action_id = create_pending_action(message)

    return (
        f"I am about to perform the following action:\n\n"
        f"→ {message}\n\n"
        f"Please confirm by replying:\n"
        f"CONFIRM {action_id}\n\n"
        f"or cancel by replying:\n"
        f"CANCEL {action_id}"
    )


def execute_confirmed_action(action: str) -> str:
    run_at = (datetime.utcnow() + timedelta(seconds=10)).isoformat()
    create_task(action, run_at)
    return "[TASK SCHEDULED] Action saved and will be executed by worker."
