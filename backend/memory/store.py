import sqlite3
from datetime import datetime

DB_NAME = "memory.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def save_memory(content: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO memories (content, created_at) VALUES (?, ?)",
        (content, datetime.utcnow().isoformat())
    )

    conn.commit()
    conn.close()


def get_recent_memories(limit: int = 5):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT content FROM memories ORDER BY id DESC LIMIT ?",
        (limit,)
    )

    rows = cursor.fetchall()
    conn.close()

    return [row[0] for row in rows]
