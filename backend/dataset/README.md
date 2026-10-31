# Dataset folder

Put your labelled news CSV file(s) here before running `python train_model.py`.

## Required format

Each CSV must have these two columns:

| column | meaning |
|---|---|
| `text` | the news article text (headline or full paragraph) |
| `label` | `0` for REAL news, `1` for FAKE news |

Example `news.csv`:

```csv
text,label
"Scientists report record global temperatures in 2024",0
"Aliens endorse a new brand of toothpaste",1
```

If your dataset has different column names, rename them to `text` and `label`
(you can do this in Excel or with pandas). Multiple CSV files in this folder
are combined automatically.

## Where to get a dataset

- ISOT Fake News Dataset (Kaggle) — combine `True.csv` (label 0) and `Fake.csv`
  (label 1) into one CSV with `text` and `label` columns.
- Search Kaggle for "fake news dataset" for more options.

The dataset is **not** included in this repo because of size/licensing.
