import time
from datetime import datetime
from tasks.store import get_pending_tasks, mark_task_done


def run_worker():
    while True:
        tasks = get_pending_tasks()

        for task_id, action in tasks:
            print(
                f"[WORKER @ {datetime.utcnow().isoformat()}] Executing: {action}"
            )
            mark_task_done(task_id)

        time.sleep(5)
