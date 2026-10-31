"""SQLite database helper: connection, initialization, and query helpers."""
import sqlite3
from flask import g

from app.config import Config


def get_db() -> sqlite3.Connection:
    """Return a per-request SQLite connection (created on first use)."""
    if "db" not in g:
        g.db = sqlite3.connect(Config.DATABASE)
        g.db.row_factory = sqlite3.Row  # rows behave like dicts
        g.db.execute("PRAGMA foreign_keys = ON;")
    return g.db


def close_db(_exc=None):
    """Close the DB connection at the end of each request."""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Create the database file and tables if they don't exist yet."""
    import os

    os.makedirs(os.path.dirname(Config.DATABASE), exist_ok=True)

    conn = sqlite3.connect(Config.DATABASE)
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            news_text TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_predictions_user_created
            ON predictions(user_id, created_at DESC);
        """
    )
    conn.commit()
    conn.close()