"""Compare baseline and character TF-IDF models on LIAR test data."""

from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)

from app.preprocess import preprocess_text

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "dataset" / "liar_dataset"

LABEL_MAP = {
    "true": "REAL",
    "mostly-true": "REAL",
    "false": "FAKE",
    "pants-fire": "FAKE",
}


def load_split(filename):
    data = pd.read_csv(
        DATA_DIR / filename,
        sep="\t",
        header=None,
        dtype=str,
        keep_default_na=False,
    )

    data = data[[1, 2]].copy()
    data.columns = ["label", "claim"]

    data["label"] = data["label"].str.strip().str.lower()
    data["target"] = data["label"].map(LABEL_MAP)
    data["claim"] = data["claim"].apply(preprocess_text)

    data = data.dropna(subset=["target"])
    data = data[data["claim"] != ""]

    return data["claim"], data["target"]


def evaluate(name, analyzer, ngram_range, max_features, c_value):
    print(f"\n{'=' * 60}")
    print(name)

    X_train_text, y_train = load_split("train.tsv")
    X_test_text, y_test = load_split("test.tsv")

    vectorizer = TfidfVectorizer(
        analyzer=analyzer,
        ngram_range=ngram_range,
        max_features=max_features,
        min_df=2,
        sublinear_tf=True,
    )

    X_train = vectorizer.fit_transform(X_train_text)
    X_test = vectorizer.transform(X_test_text)

    model = LogisticRegression(
        C=c_value,
        max_iter=2000,
        class_weight="balanced",
        random_state=42,
    )
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    print(f"Test accuracy: {accuracy_score(y_test, predictions):.4f}")
    print(
        "Test macro F1: "
        f"{f1_score(y_test, predictions, average='macro'):.4f}"
    )
    print(
        "Test FAKE F1: "
        f"{f1_score(y_test, predictions, pos_label='FAKE'):.4f}"
    )

    print("\nClassification report:")
    print(
        classification_report(
            y_test,
            predictions,
            labels=["FAKE", "REAL"],
            zero_division=0,
        )
    )

    print("Confusion matrix (rows=true, columns=predicted):")
    print(confusion_matrix(y_test, predictions, labels=["FAKE", "REAL"]))


def main():
    evaluate(
        "Baseline: Word TF-IDF",
        analyzer="word",
        ngram_range=(1, 2),
        max_features=30000,
        c_value=1.0,
    )

    evaluate(
        "Candidate: Character TF-IDF",
        analyzer="char",
        ngram_range=(3, 5),
        max_features=50000,
        c_value=1.0,
    )

    print("\nEvaluation complete. No saved model files were changed.")


if __name__ == "__main__":
    main()