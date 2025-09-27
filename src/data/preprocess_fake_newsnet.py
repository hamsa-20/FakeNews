import json
from pathlib import Path
from src.data.dataset_loader import read_jsonl

ROOT = Path.cwd()
RAW = ROOT / "data" / "raw" / "FakeNewsNet"
SAMPLES = ROOT / "data" / "samples"
PROC = ROOT / "data" / "processed"
PROC.mkdir(parents=True, exist_ok=True)

# For starter: if raw doesn't exist, copy sample to processed
def preprocess():
    raw_file = RAW / "news.jsonl"
    sample = SAMPLES / "fake_newsnet_sample.jsonl"
    if not raw_file.exists():
        print(f"{raw_file} not found — using sample {sample}")
        raw_file = sample

    items = read_jsonl(raw_file)
    out_path = PROC / "fake_newsnet_text.jsonl"
    with out_path.open("w", encoding="utf8") as w:
        for o in items:
            # unify fields: text, label (int)
            text = o.get("text", "")
            label = o.get("label", 0)
            obj = {"text": text, "label": int(label)}
            w.write(json.dumps(obj, ensure_ascii=False) + "\n")
    print("Saved processed:", out_path)

if __name__ == "__main__":
    preprocess()
