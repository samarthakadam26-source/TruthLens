"""Authentication helpers: password hashing, login, logout, current user."""
from functools import wraps

from flask import session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from app.database import get_db


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return check_password_hash(password_hash, password)


def login_user(user_row) -> None:
    """Store the user's id in the session. user_row is a sqlite3.Row."""
    session["user_id"] = user_row["id"]
    session.permanent = True


def logout_user() -> None:
    session.pop("user_id", None)


def get_current_user():
    """Return the current user's row, or None if not logged in."""
    user_id = session.get("user_id")
    if user_id is None:
        return None
    db = get_db()
    return db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()


def login_required(view):
    """Decorator: return 401 if the user is not logged in."""

    @wraps(view)
    def wrapped(*args, **kwargs):
        if get_current_user() is None:
            return jsonify({"error": "Authentication required. Please log in."}), 401
        return view(*args, **kwargs)

    return wrapped