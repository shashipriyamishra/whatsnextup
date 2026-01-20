import threading
import time
from datetime import datetime


def run_after_delay(delay_seconds: int, action: str):
    def task():
        time.sleep(delay_seconds)
        print(
            f"[BACKGROUND TASK EXECUTED @ {datetime.utcnow().isoformat()}] {action}"
        )

    thread = threading.Thread(target=task)
    thread.daemon = True
    thread.start()
