
import pandas as pd
from pathlib import Path

# Original dataset location
SOURCE_DIR = Path.home() / "Desktop" / "TruthLens_Dataset"

# Output dataset location
DEST_DIR = Path(__file__).parent / "dataset"

fake_file = SOURCE_DIR / "Fake.csv"
real_file = SOURCE_DIR / "True.csv"

# Check input files
if not fake_file.exists() or not real_file.exists():
    raise FileNotFoundError(
        f"Could not find Fake.csv and True.csv in: {SOURCE_DIR}"
    )

print("Reading original CSV files...")

fake_df = pd.read_csv(fake_file)
real_df = pd.read_csv(real_file)

# Verify required columns
required_columns = ["title", "text"]

for name, df in [("Fake.csv", fake_df), ("True.csv", real_df)]:
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValueError(f"{name} is missing columns: {missing}")

# Keep titles and text, and assign labels
fake_df = fake_df[["title", "text"]].copy()
fake_df["label"] = 1

real_df = real_df[["title", "text"]].copy()
real_df["label"] = 0

# Combine both datasets
data = pd.concat([real_df, fake_df], ignore_index=True)

# Remove missing values
data = data.dropna(subset=["title", "text"])

# Clean titles and article text
for column in ["title", "text"]:
    data[column] = data[column].astype(str).str.strip()

# Remove rows with empty titles or text
data = data[
    (data["title"] != "") &
    (data["text"] != "")
].copy()

# Remove duplicate articles using normalized title and text
data["_title_key"] = data["title"].str.lower()
data["_text_key"] = data["text"].str.lower()

data = data.drop_duplicates(
    subset=["_title_key", "_text_key"]
)

data = data.drop(columns=["_title_key", "_text_key"])

# Shuffle dataset
data = data.sample(frac=1, random_state=42).reset_index(drop=True)

# Create destination directory
DEST_DIR.mkdir(parents=True, exist_ok=True)

# Save prepared dataset
output_file = DEST_DIR / "news.csv"
data.to_csv(output_file, index=False, encoding="utf-8")

print("\nDataset prepared successfully!")
print(f"Saved to: {output_file}")
print(f"Total articles: {len(data):,}")

print("\nLabel counts:")
print(
    data["label"].value_counts().sort_index().rename(
        index={0: "REAL (0)", 1: "FAKE (1)"}
    )
)

print("\nDuplicate title-text pairs remaining:",
      data.duplicated(subset=["title", "text"]).sum())
