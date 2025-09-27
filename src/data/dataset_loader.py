# unified dataset loader utilities
from pathlib import Path
import json

def read_jsonl(path):
    path = Path(path)
    objs = []
    if not path.exists():
        return objs
    with path.open("r", encoding="utf8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                objs.append(json.loads(line))
            except Exception as e:
                # skip bad lines
                print(f"skip bad line in {path}: {e}")
    return objs
