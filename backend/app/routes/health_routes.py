"""Health-check route (public)."""
from flask import Blueprint, jsonify
from app.config import Config
import os

bp = Blueprint("health", __name__)


@bp.get("/api/health")
def health():
    model_trained = os.path.exists(Config.VECTORIZER_PATH) and os.path.exists(Config.MODEL_PATH)
    return jsonify({
        "status": "ok",
        "service": "TruthLens API",
        "modelTrained": model_trained,
    })