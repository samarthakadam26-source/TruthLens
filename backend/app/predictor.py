"""Load the LIAR model and predict political-claim labels."""

from pathlib import Path

import joblib

from app.preprocess import preprocess_text


# Load the new model files without overwriting the original model.
MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
MODEL_PATH = MODEL_DIR / "liar_model.joblib"
VECTORIZER_PATH = MODEL_DIR / "liar_vectorizer.joblib"


class ModelNotTrainedError(Exception):
    """Raised when the trained model or vectorizer is missing."""


def _load_artifacts():
    """Load the LIAR model and vectorizer."""
    if not MODEL_PATH.exists() or not VECTORIZER_PATH.exists():
        raise ModelNotTrainedError(
            "The LIAR model is missing. Run train_model.py first."
        )

    vectorizer = joblib.load(VECTORIZER_PATH)
    model = joblib.load(MODEL_PATH)

    return vectorizer, model


def predict_news(text: str):
    """Return (label, confidence) for a political claim."""
    if not text or not text.strip():
        raise ValueError("News text is empty.")

    vectorizer, model = _load_artifacts()

    cleaned = preprocess_text(text)

    if not cleaned:
        raise ValueError(
            "Text became empty after preprocessing. "
            "Provide meaningful text."
        )

    features = vectorizer.transform([cleaned])
    prediction = model.predict(features)[0]

    confidence = None

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[0]
        classes = list(model.classes_)
        confidence = float(probabilities[classes.index(prediction)])

    label = str(prediction).upper()

    if label not in ("REAL", "FAKE"):
        raise ValueError(
            f"Model returned an unexpected label: {prediction}"
        )

    return label, confidence