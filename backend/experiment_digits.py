"""Compare current preprocessing against digit-preserving preprocessing."""

from pathlib import Path
import re
import string

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "dataset" / "liar_dataset"

LABEL_MAP = {
    "true": "REAL",
    "mostly-true": "REAL",
    "false": "FAKE",
    "pants-fire": "FAKE",
}


def preprocess_current(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = text.lower()
    text = re.sub(r"\d+", " ", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    return re.sub(r"\s+", " ", text).strip()


def preprocess_keep_digits(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = text.lower()
    # Keep digits; remove punctuation as before.
    text = text.translate(str.maketrans("", "", string.punctuation))
    return re.sub(r"\s+", " ", text).strip()


def load_split(filename, preprocess):
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
    data["claim"] = data["claim"].apply(preprocess)
    data = data.dropna(subset=["target"])
    data = data[data["claim"] != ""]
    return data["claim"], data["target"]


def evaluate_variant(name, preprocess):
    X_train_text, y_train = load_split("train.tsv", preprocess)
    X_valid_text, y_valid = load_split("valid.tsv", preprocess)

    vectorizer = TfidfVectorizer(
        max_features=30000,
        ngram_range=(1, 2),
        min_df=2,
        sublinear_tf=True,
    )
    X_train = vectorizer.fit_transform(X_train_text)
    X_valid = vectorizer.transform(X_valid_text)

    best = None
    best_c = None
    best_f1 = -1.0

    for c_value in [0.5, 1.0, 2.0]:
        model = LogisticRegression(
            C=c_value,
            max_iter=2000,
            class_weight="balanced",
            random_state=42,
        )
        model.fit(X_train, y_train)
        pred = model.predict(X_valid)
        score = f1_score(
            y_valid, pred, pos_label="FAKE", zero_division=0
        )
        print(f"{name} | C={c_value} | Validation FAKE F1={score:.4f}")

        if score > best_f1:
            best_f1 = score
            best = model
            best_c = c_value

    predictions = best.predict(X_valid)
    accuracy = accuracy_score(y_valid, predictions)

    print(f"Best C: {best_c}")
    print(f"Validation accuracy: {accuracy:.4f}")
    print(f"Validation FAKE F1: {best_f1:.4f}")

    return {
        "variant": name,
        "C": best_c,
        "validation_accuracy": accuracy,
        "validation_FAKE_F1": best_f1,
    }


def main():
    results = [
        evaluate_variant("Current preprocessing", preprocess_current),
        evaluate_variant("Preserve digits", preprocess_keep_digits),
    ]

    print("\n========== VALIDATION COMPARISON ==========")
    print(pd.DataFrame(results).to_string(index=False))
    print("\nNo saved models were changed. Test data was not used.")


if __name__ == "__main__":
    main()