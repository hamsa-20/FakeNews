import pandas as pd
from pathlib import Path

RAW_DIR = Path("data/raw/MediaEval")
PROCESSED_DIR = Path("data/processed/MediaEval")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

COLUMN_MAP = {
    "post_text": "text",
    "text": "text",
    "image": "image_path",
    "img_path": "image_path",
    "likes": "social_features",
    "shares": "social_features",
    "comments": "social_features",
    "label": "label",
    "category": "label"
}

def preprocess():
    file_path = RAW_DIR / "mediaeval.jsonl"
    df = pd.read_json(file_path, lines=True)

    existing_columns = [col for col in df.columns if col in COLUMN_MAP]
    df = df[existing_columns].rename(columns={col: COLUMN_MAP[col] for col in existing_columns})

    if "social_features" in df.columns:
        df["social_features"] = df["social_features"].apply(lambda x: x if isinstance(x, list) else [x])

    df.to_json(PROCESSED_DIR / "mediaeval_processed.jsonl", orient="records", lines=True)
    print(f"Preprocessed MediaEval data saved at {PROCESSED_DIR / 'mediaeval_processed.jsonl'}")

if __name__ == "__main__":
    preprocess()
