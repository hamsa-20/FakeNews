import pandas as pd
from pathlib import Path

RAW_DIR = Path("data/raw/SocialContext")
PROCESSED_DIR = Path("data/processed/SocialContext")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

COLUMN_MAP = {
    "post": "text",
    "text": "text",
    "image_url": "image_path",
    "image_path": "image_path",
    "likes_count": "social_features",
    "shares_count": "social_features",
    "comments_count": "social_features",
    "label": "label",
    "category": "label"
}

def preprocess():
    file_path = RAW_DIR / "socialcontext.jsonl"
    df = pd.read_json(file_path, lines=True)

    existing_columns = [col for col in df.columns if col in COLUMN_MAP]
    df = df[existing_columns].rename(columns={col: COLUMN_MAP[col] for col in existing_columns})

    if "social_features" in df.columns:
        df["social_features"] = df["social_features"].apply(lambda x: x if isinstance(x, list) else [x])

    df.to_json(PROCESSED_DIR / "socialcontext_processed.jsonl", orient="records", lines=True)
    print(f"Preprocessed SocialContext data saved at {PROCESSED_DIR / 'socialcontext_processed.jsonl'}")

if __name__ == "__main__":
    preprocess()
