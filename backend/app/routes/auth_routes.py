"""Authentication routes: register, login, logout, me."""
from flask import Blueprint, request, jsonify

from app.auth import hash_password, verify_password, login_user, logout_user, get_current_user, login_required
from app.database import get_db

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("fullName") or data.get("full_name") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    db = get_db()
    if db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone():
        return jsonify({"error": "An account with this email already exists."}), 409

    db.execute(
        "INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)",
        (email, hash_password(password), full_name or None),
    )
    db.commit()

    user_row = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    login_user(user_row)
    return jsonify(_public_user(user_row)), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    db = get_db()
    user_row = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not user_row or not verify_password(password, user_row["password_hash"]):
        return jsonify({"error": "Invalid email or password."}), 401

    login_user(user_row)
    return jsonify(_public_user(user_row))


@bp.post("/logout")
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully."})


@bp.get("/me")
@login_required
def me():
    return jsonify(_public_user(get_current_user()))


@bp.put("/me")
@login_required
def update_me():
    """Update the current user's display name."""
    data = request.get_json(silent=True) or {}
    full_name = (data.get("fullName") or "").strip()
    if len(full_name) < 2:
        return jsonify({"error": "Name must be at least 2 characters."}), 400

    db = get_db()
    db.execute("UPDATE users SET full_name = ? WHERE id = ?", (full_name, get_current_user()["id"]))
    db.commit()
    return jsonify(_public_user(db.execute(
        "SELECT * FROM users WHERE id = ?", (get_current_user()["id"],)).fetchone()))


def _public_user(user_row):
    """Return only safe fields of a user (never the password hash)."""
    return {
        "id": user_row["id"],
        "email": user_row["email"],
        "fullName": user_row["full_name"],
        "createdAt": user_row["created_at"],
    }