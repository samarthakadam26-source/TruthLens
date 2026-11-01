
"""Application configuration loaded from environment variables / .env file."""

import os
from dotenv import load_dotenv

# Load variables from backend/.env if it exists
load_dotenv()

BASE_DIR = os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))
)


class Config:

    # Secret key for Flask sessions
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "dev-secret-change-me"
    )

    # API keys
    TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

    # Session cookie settings
    SESSION_COOKIE_SAMESITE = os.environ.get(
        "SESSION_COOKIE_SAMESITE", "Lax"
    )
    

    SESSION_COOKIE_SECURE = (
        os.environ.get(
            "SESSION_COOKIE_SECURE", "false"
        ).lower() == "true"
    )

    SESSION_COOKIE_HTTPONLY = True

    # SQLite database file
    DATABASE_PATH = os.environ.get(
        "DATABASE_PATH", "data/truthlens.db"
    )

    DATABASE = os.path.join(BASE_DIR, DATABASE_PATH)

    # Trained model and vectorizer storage
    MODEL_DIR = os.path.join(
        BASE_DIR,
        os.environ.get("MODEL_DIR", "models")
    )

    MODEL_PATH = os.path.join(
        MODEL_DIR, "model.joblib"
    )

    VECTORIZER_PATH = os.path.join(
        MODEL_DIR, "vectorizer.joblib"
    )

    # Dataset folder
    DATASET_DIR = os.path.join(
        BASE_DIR,
        os.environ.get("DATASET_DIR", "dataset")
    )

    # CORS origins
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS",
            "http://localhost:5173"
        ).split(",")
        if origin.strip()
    ]

    # Flask debug mode
    DEBUG = (
        os.environ.get("FLASK_DEBUG", "false").lower()
        == "true"
    )
