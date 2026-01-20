import sqlite3
from datetime import datetime

DB_NAME = "tasks.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_tasks_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            status TEXT NOT NULL,
            run_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def create_task(action: str, run_at: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO tasks (action, status, run_at) VALUES (?, ?, ?)",
        (action, "PENDING", run_at)
    )

    conn.commit()
    conn.close()


def get_pending_tasks():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, action FROM tasks WHERE status='PENDING'"
    )

    rows = cursor.fetchall()
    conn.close()
    return rows


def mark_task_done(task_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE tasks SET status='DONE' WHERE id=?",
        (task_id,)
    )

    conn.commit()
    conn.close()
