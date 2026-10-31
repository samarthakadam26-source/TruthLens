"""
TruthLens: Train a claim-classification model using the LIAR dataset.

Labels:
    REAL = true, mostly-true
    FAKE = false, pants-fire

Ambiguous labels (barely-true, half-true) are excluded.
The original model files are not overwritten.
"""

from pathlib import Path

import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import ParameterGrid

from app.config import Config
from app.preprocess import preprocess_text


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "dataset" / "liar_dataset"
MODEL_DIR = Path(Config.MODEL_DIR)

# Save separately so the existing model remains safe.
NEW_MODEL_PATH = MODEL_DIR / "liar_model.joblib"
NEW_VECTORIZER_PATH = MODEL_DIR / "liar_vectorizer.joblib"

LABEL_MAP = {
    "true": "REAL",
    "mostly-true": "REAL",
    "false": "FAKE",
    "pants-fire": "FAKE",
}

SPLITS = ["train.tsv", "valid.tsv", "test.tsv"]


def load_split(filename):
    path = DATA_DIR / filename

    if not path.exists():
        raise FileNotFoundError(
            f"Missing dataset file: {path}"
        )

    # LIAR TSV has no header:
    # Column 1 = truthfulness label
    # Column 2 = statement
    data = pd.read_csv(
        path,
        sep="\t",
        header=None,
        dtype=str,
        keep_default_na=False,
    )

    if data.shape[1] < 3:
        raise ValueError(
            f"{filename} does not have the expected LIAR format."
        )

    data = data[[1, 2]].copy()
    data.columns = ["label", "claim"]

    data["label"] = data["label"].str.strip().str.lower()
    data["claim"] = data["claim"].str.strip()

    # Keep only clear-enough labels for this binary demonstration.
    data = data[data["label"].isin(LABEL_MAP)].copy()
    data["target"] = data["label"].map(LABEL_MAP)

    data = data[data["claim"] != ""].copy()
    data["claim"] = data["claim"].apply(preprocess_text)
    data = data[data["claim"] != ""].copy()

    return data[["claim", "target"]]


def main():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    for filename in SPLITS:
        if not (DATA_DIR / filename).exists():
            raise FileNotFoundError(
                f"Required file not found: {DATA_DIR / filename}"
            )

    train_data = load_split("train.tsv")
    valid_data = load_split("valid.tsv")
    test_data = load_split("test.tsv")

    if any(data.empty for data in (train_data, valid_data, test_data)):
        raise ValueError(
            "A dataset split has no usable claims. Check the TSV files."
        )

    print("Usable claims after excluding ambiguous labels:")
    print(f"Training:   {len(train_data):,}")
    print(f"Validation: {len(valid_data):,}")
    print(f"Testing:    {len(test_data):,}")

    print("\nTraining label counts:")
    print(train_data["target"].value_counts().to_string())

    # Fit the vectorizer on training data only.
    vectorizer = TfidfVectorizer(
        max_features=30000,
        ngram_range=(1, 2),
        min_df=2,
        sublinear_tf=True,
    )

    X_train = vectorizer.fit_transform(train_data["claim"])
    X_valid = vectorizer.transform(valid_data["claim"])
    X_test = vectorizer.transform(test_data["claim"])

    y_train = train_data["target"]
    y_valid = valid_data["target"]
    y_test = test_data["target"]

    best_model = None
    best_c = None
    best_f1 = -1.0

    # Choose regularization using validation data, not test data.
    for c_value in [0.5, 1.0, 2.0, 4.0]:
        model = LogisticRegression(
            C=c_value,
            max_iter=2000,
            class_weight="balanced",
            random_state=42,
        )

        model.fit(X_train, y_train)
        valid_predictions = model.predict(X_valid)

        valid_f1 = f1_score(
            y_valid,
            valid_predictions,
            pos_label="FAKE",
            zero_division=0,
        )

        print(
            f"\nC={c_value:g} | "
            f"Validation FAKE F1: {valid_f1:.4f}"
        )

        if valid_f1 > best_f1:
            best_f1 = valid_f1
            best_c = c_value
            best_model = model

    print(f"\nSelected C: {best_c:g}")
    print(f"Best validation FAKE F1: {best_f1:.4f}")

    # Evaluate the selected model on the untouched test split.
    test_predictions = best_model.predict(X_test)

    print("\n========== TEST RESULTS ==========")
    print(f"Accuracy: {accuracy_score(y_test, test_predictions):.4f}")
    print(
        "Macro F1: "
        f"{f1_score(y_test, test_predictions, average='macro'):.4f}"
    )

    print("\nClassification report:")
    print(
        classification_report(
            y_test,
            test_predictions,
            labels=["FAKE", "REAL"],
            zero_division=0,
        )
    )

    print("Confusion matrix (rows=true, columns=predicted):")
    print(
        confusion_matrix(
            y_test,
            test_predictions,
            labels=["FAKE", "REAL"],
        )
    )

    # Save to NEW files; don't replace the existing model yet.
    joblib.dump(best_model, NEW_MODEL_PATH)
    joblib.dump(vectorizer, NEW_VECTORIZER_PATH)

    print("\nNew model and vectorizer saved:")
    print(NEW_MODEL_PATH)
    print(NEW_VECTORIZER_PATH)

    print(
        "\nTraining completed. The existing model is unchanged. "
        "The new model has not been connected to the website yet."
    )


if __name__ == "__main__":
    main()