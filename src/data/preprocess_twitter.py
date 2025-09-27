import pandas as pd
from pathlib import Path

RAW_DIR = Path("data/raw/Twitter")       # Change per dataset
PROCESSED_DIR = Path("data/processed/Twitter")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

# Mapping from existing dataset columns -> standard columns
COLUMN_MAP = {
    "tweet_text": "text",
    "text": "text",
    "img_path": "image_path",
    "image_path": "image_path",
    "likes": "social_features",
    "retweets": "social_features",
    "shares": "social_features",
    "label": "label",
    "category": "label"
}

def preprocess():
    file_path = RAW_DIR / "twitter.jsonl"  # replace with dataset file
    df = pd.read_json(file_path, lines=True)

    # Keep only columns that exist in dataset and map them
    existing_columns = [col for col in df.columns if col in COLUMN_MAP]
    df = df[existing_columns].rename(columns={col: COLUMN_MAP[col] for col in existing_columns})

    # Ensure social_features is a list (needed for your model)
    if "social_features" in df.columns:
        df["social_features"] = df["social_features"].apply(lambda x: x if isinstance(x, list) else [x])

    df.to_json(PROCESSED_DIR / "twitter_processed.jsonl", orient="records", lines=True)
    print(f"Preprocessed Twitter data saved at {PROCESSED_DIR / 'twitter_processed.jsonl'}")

if __name__ == "__main__":
    preprocess()
