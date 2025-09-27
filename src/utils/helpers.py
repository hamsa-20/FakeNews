import json
from pathlib import Path

def write_jsonl(path, items):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf8") as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False)+"\n")
