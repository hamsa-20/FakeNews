import kagglehub
from pathlib import Path
import zipfile
import shutil
import pandas as pd

RAW_DIR = Path("data/raw")
RAW_DIR.mkdir(parents=True, exist_ok=True)

def download_fakenewsnet():
    dataset_name = "mdepak/fakenewsnet"
    path = kagglehub.dataset_download(dataset_name)
    print("Downloaded FakeNewsNet path:", path)

    # Extract if zip
    if path.endswith(".zip"):
        with zipfile.ZipFile(path, "r") as zip_ref:
            zip_ref.extractall(RAW_DIR / "FakeNewsNet")
        print(f"FakeNewsNet extracted to {RAW_DIR / 'FakeNewsNet'}")

def download_twitter():
    dataset_name = "your/twitter-dataset-name"  # replace with actual Kaggle dataset
    path = kagglehub.dataset_download(dataset_name)
    print("Downloaded Twitter path:", path)

    # Extract or move CSV/JSONL
    target_dir = RAW_DIR / "Twitter"
    target_dir.mkdir(exist_ok=True)
    if path.endswith(".zip"):
        with zipfile.ZipFile(path, "r") as zip_ref:
            zip_ref.extractall(target_dir)
    else:
        shutil.move(path, target_dir)
    print(f"Twitter dataset ready at {target_dir}")

def download_mediaeval():
    dataset_name = "your/mediaeval-dataset-name"  # replace with actual Kaggle dataset
    path = kagglehub.dataset_download(dataset_name)
    print("Downloaded MediaEval path:", path)

    target_dir = RAW_DIR / "MediaEval"
    target_dir.mkdir(exist_ok=True)
    if path.endswith(".zip"):
        with zipfile.ZipFile(path, "r") as zip_ref:
            zip_ref.extractall(target_dir)
    else:
        shutil.move(path, target_dir)
    print(f"MediaEval dataset ready at {target_dir}")

def download_socialcontext():
    dataset_name = "your/socialcontext-dataset-name"  # replace with actual Kaggle dataset
    path = kagglehub.dataset_download(dataset_name)
    print("Downloaded SocialContext path:", path)

    target_dir = RAW_DIR / "SocialContext"
    target_dir.mkdir(exist_ok=True)
    if path.endswith(".zip"):
        with zipfile.ZipFile(path, "r") as zip_ref:
            zip_ref.extractall(target_dir)
    else:
        shutil.move(path, target_dir)
    print(f"SocialContext dataset ready at {target_dir}")

if __name__ == "__main__":
    download_fakenewsnet()
    download_twitter()
    download_mediaeval()
    download_socialcontext()
