"""Prediction + history + dashboard routes."""
import logging
from flask import Blueprint, request, jsonify

from app.auth import login_required, get_current_user
from app.database import get_db
from app.predictor import predict_news, ModelNotTrainedError

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.post("/predict")
@login_required
def predict():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "Please provide news text to analyze."}), 400
    if len(text) < 10:
        return jsonify({"error": "Text is too short. Please enter at least 10 characters."}), 422
    if len(text) > 5000:
        return jsonify({"error": "Text exceeds the 5000 character limit."}), 422

    try:
        label, confidence = predict_news(text)
    except ModelNotTrainedError as e:
        return jsonify({"error": str(e), "modelNotTrained": True}), 503
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except Exception:  # noqa: BLE001 - log details on the server, not in the browser
        logging.exception("Unexpected error while predicting news")
        return jsonify({"error": "Prediction failed due to an internal server error. Please check the backend logs and model setup."}), 500

    user = get_current_user()
    db = get_db()
    cursor = db.execute(
        "INSERT INTO predictions (user_id, news_text, prediction, confidence) VALUES (?, ?, ?, ?)",
        (user["id"], text, label, confidence),
    )
    db.commit()
    record_id = cursor.lastrowid

    return jsonify({
        "prediction": label,
        "confidence": confidence,
        "analysisId": str(record_id),
    })


# ── History ─────────────────────────────────────────────────────────────────

@bp.get("/history")
@login_required
def list_history():
    user = get_current_user()
    db = get_db()
    rows = db.execute(
        "SELECT id, news_text, prediction, confidence, created_at FROM predictions "
        "WHERE user_id = ? ORDER BY created_at DESC",
        (user["id"],),
    ).fetchall()
    return jsonify([_serialize_record(r) for r in rows])


@bp.get("/history/<int:record_id>")
@login_required
def get_history(record_id: int):
    user = get_current_user()
    db = get_db()
    row = db.execute(
        "SELECT id, news_text, prediction, confidence, created_at FROM predictions "
        "WHERE id = ? AND user_id = ?",
        (record_id, user["id"]),
    ).fetchone()
    if not row:
        return jsonify({"error": "Record not found or you do not have permission to view it."}), 404
    return jsonify(_serialize_record(row))


@bp.delete("/history/<int:record_id>")
@login_required
def delete_history(record_id: int):
    user = get_current_user()
    db = get_db()
    result = db.execute(
        "DELETE FROM predictions WHERE id = ? AND user_id = ?",
        (record_id, user["id"]),
    )
    db.commit()
    if result.rowcount == 0:
        return jsonify({"error": "Record not found or you do not have permission to delete it."}), 404
    return jsonify({"message": "Record deleted."})


@bp.delete("/history")
@login_required
def clear_history():
    user = get_current_user()
    db = get_db()
    db.execute("DELETE FROM predictions WHERE user_id = ?", (user["id"],))
    db.commit()
    return jsonify({"message": "All history cleared."})


# ── Dashboard stats ─────────────────────────────────────────────────────────

@bp.get("/dashboard/stats")
@login_required
def dashboard_stats():
    user = get_current_user()
    db = get_db()
    total = db.execute(
        "SELECT COUNT(*) AS c FROM predictions WHERE user_id = ?", (user["id"],)
    ).fetchone()["c"]
    real = db.execute(
        "SELECT COUNT(*) AS c FROM predictions WHERE user_id = ? AND prediction = 'REAL'",
        (user["id"],),
    ).fetchone()["c"]
    fake = db.execute(
        "SELECT COUNT(*) AS c FROM predictions WHERE user_id = ? AND prediction = 'FAKE'",
        (user["id"],),
    ).fetchone()["c"]
    recent = db.execute(
        "SELECT id, news_text, prediction, confidence, created_at FROM predictions "
        "WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
        (user["id"],),
    ).fetchall()
    return jsonify({
        "total": total,
        "real": real,
        "fake": fake,
        "recent": [_serialize_record(r) for r in recent],
    })


# ── Health ──────────────────────────────────────────────────────────────────

def _serialize_record(row):
    return {
        "id": str(row["id"]),
        "news_text": row["news_text"],
        "prediction": row["prediction"],
        "confidence": row["confidence"],
        "created_at": row["created_at"],
    }