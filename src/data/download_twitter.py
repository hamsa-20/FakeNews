# import pandas as pd
# import json
# from pathlib import Path
# import kagglehub

# # ---------- Set paths ----------
# RAW_DIR = Path("data/raw/Twitter")
# RAW_DIR.mkdir(parents=True, exist_ok=True)
# JSONL_PATH = RAW_DIR / "twitter.jsonl"

# # ---------- Step 1: Download dataset ----------
# print("Downloading FakeNewsNet dataset via kagglehub...")
# dataset_path = kagglehub.dataset_download("mdepak/fakenewsnet")
# print("Dataset downloaded at:", dataset_path)

# # ---------- Step 2: Read CSV files ----------
# # Adjust filenames depending on the extracted files
# news_csv = RAW_DIR / "news.csv"
# social_csv = RAW_DIR / "social_context.csv"

# news_df = pd.read_csv(news_csv)
# social_df = pd.read_csv(social_csv)

# # ---------- Step 3: Convert to JSONL ----------
# with open(JSONL_PATH, "w", encoding="utf-8") as f:
#     for _, row in news_df.iterrows():
#         news_id = row["news_id"]
#         text = row["text"]
#         label = row["label"]

#         # Get social features for this news_id
#         social_row = social_df[social_df["news_id"] == news_id].iloc[0]
#         social_features = [
#             int(social_row["retweets"]),
#             int(social_row["likes"]),
#             int(social_row["replies"])
#         ]

#         record = {
#             "text": text,
#             "image_path": "",  # leave blank if no images
#             "social_features": social_features,
#             "label": label
#         }
#         f.write(json.dumps(record) + "\n")

# print(f"twitter.jsonl created at {JSONL_PATH}")
import kagglehub
from pathlib import Path

# Choose your own download folder
download_folder = Path("data/raw/Twitter")
download_folder.mkdir(parents=True, exist_ok=True)

# Download dataset
path = kagglehub.dataset_download("mdepak/fakenewsnet", download_folder)
print("Downloaded dataset path:", path)
