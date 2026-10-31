"""Application configuration loaded from environment variables / .env file."""
import os
from dotenv import load_dotenv

# Load variables from backend/.env if it exists
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

    # SQLite database file (created on first run)
    DATABASE_PATH = os.environ.get("DATABASE_PATH", "data/truthlens.db")
    DATABASE = os.path.join(BASE_DIR, DATABASE_PATH)

    # Trained model + vectorizer storage
    MODEL_DIR = os.path.join(BASE_DIR, os.environ.get("MODEL_DIR", "models"))
    MODEL_PATH = os.path.join(MODEL_DIR, "model.joblib")
    VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.joblib")

    # Dataset folder (labelled CSV files used for training)
    DATASET_DIR = os.path.join(BASE_DIR, os.environ.get("DATASET_DIR", "dataset"))

    # CORS origins (comma separated)
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]

    DEBUG = os.environ.get("FLASK_DEBUG", "false").lower() == "true"