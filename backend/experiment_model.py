"""Compare TF-IDF configurations using LIAR train/validation/test splits.
Existing model files are not modified.
"""

from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
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
    path = DATA_DIR / filename
    data = pd.read_csv(
        path,
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


def main():
    X_train_text, y_train = load_split("train.tsv")
    X_valid_text, y_valid = load_split("valid.tsv")
    X_test_text, y_test = load_split("test.tsv")

    experiments = [
        {
            "name": "Word TF-IDF (baseline)",
            "analyzer": "word",
            "ngram_range": (1, 2),
            "max_features": 30000,
        },
        {
            "name": "Word TF-IDF (unigrams)",
            "analyzer": "word",
            "ngram_range": (1, 1),
            "max_features": 30000,
        },
        {
            "name": "Character TF-IDF",
            "analyzer": "char",
            "ngram_range": (3, 5),
            "max_features": 50000,
        },
        {
            "name": "Combined word + character",
            "analyzer": "word_char",
            "ngram_range": (1, 2),
            "max_features": 30000,
        },
    ]

    results = []

    for experiment in experiments:
        print(f"\n{'=' * 60}")
        print(experiment["name"])

        if experiment["analyzer"] == "word_char":
            from sklearn.pipeline import FeatureUnion

            vectorizer = FeatureUnion([
                (
                    "word",
                    TfidfVectorizer(
                        analyzer="word",
                        ngram_range=(1, 2),
                        max_features=30000,
                        min_df=2,
                        sublinear_tf=True,
                    ),
                ),
                (
                    "char",
                    TfidfVectorizer(
                        analyzer="char",
                        ngram_range=(3, 5),
                        max_features=50000,
                        min_df=2,
                        sublinear_tf=True,
                    ),
                ),
            ])
        else:
            vectorizer = TfidfVectorizer(
                analyzer=experiment["analyzer"],
                ngram_range=experiment["ngram_range"],
                max_features=experiment["max_features"],
                min_df=2,
                sublinear_tf=True,
            )

        X_train = vectorizer.fit_transform(X_train_text)
        X_valid = vectorizer.transform(X_valid_text)

        best_model = None
        best_c = None
        best_f1 = -1

        for c_value in [0.5, 1.0, 2.0]:
            model = LogisticRegression(
                C=c_value,
                max_iter=2000,
                class_weight="balanced",
                random_state=42,
            )
            model.fit(X_train, y_train)
            predictions = model.predict(X_valid)

            score = f1_score(
                y_valid,
                predictions,
                pos_label="FAKE",
                zero_division=0,
            )

            print(f"C={c_value}: validation FAKE F1={score:.4f}")

            if score > best_f1:
                best_f1 = score
                best_c = c_value
                best_model = model

        valid_predictions = best_model.predict(X_valid)

        results.append({
            "experiment": experiment["name"],
            "C": best_c,
            "validation_FAKE_F1": best_f1,
            "validation_accuracy": accuracy_score(
                y_valid, valid_predictions
            ),
        })

        print(f"Selected C: {best_c}")
        print(f"Validation accuracy: "
              f"{accuracy_score(y_valid, valid_predictions):.4f}")

    print("\n\n========== VALIDATION COMPARISON ==========")
    print(pd.DataFrame(results).to_string(index=False))

    print(
        "\nNo existing model files were changed. "
        "No test-set results were used to select a configuration."
    )


if __name__ == "__main__":
    main()