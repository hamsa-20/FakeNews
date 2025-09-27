import yaml
from pathlib import Path
import torch
from torch.utils.data import DataLoader, Dataset
from transformers import AutoTokenizer
import torch.nn as nn
from sklearn.model_selection import train_test_split
import json

# local imports
from src.models.bert_text_classifier import BertClassifier

ROOT = Path.cwd()
with open(ROOT / "config.yaml") as f:
    cfg = yaml.safe_load(f)

PROC = ROOT / "data" / "processed"
data_file = PROC / "fake_newsnet_text.jsonl"

# simple dataset
class NewsDataset(Dataset):
    def __init__(self, items, tokenizer_name, max_len=128):
        from transformers import AutoTokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
        self.items = items
        self.max_len = max_len

    def __len__(self): return len(self.items)

    def __getitem__(self, idx):
        it = self.items[idx]
        text = it["text"]
        lab = int(it["label"])
        enc = self.tokenizer(text, truncation=True, padding="max_length", max_length=self.max_len, return_tensors="pt")
        return {
            "input_ids": enc["input_ids"].squeeze(0),
            "attention_mask": enc["attention_mask"].squeeze(0),
            "label": torch.tensor(lab, dtype=torch.long)
        }

def load_items(path):
    items = []
    if not path.exists():
        raise FileNotFoundError(path)
    with path.open("r", encoding="utf8") as f:
        for l in f:
            items.append(json.loads(l))
    return items

def collate_fn(batch):
    input_ids = torch.stack([b["input_ids"] for b in batch])
    attention_mask = torch.stack([b["attention_mask"] for b in batch])
    labels = torch.stack([b["label"] for b in batch])
    return {"input_ids": input_ids, "attention_mask": attention_mask, "labels": labels}

def train():
    items = load_items(data_file)
    # small subset for fast run
    if len(items) > 100:
        items = items[:100]
    train_items, val_items = train_test_split(items, test_size=0.2, random_state=42)
    ds_train = NewsDataset(train_items, tokenizer_name=cfg["model"]["text_model_name"], max_len=cfg["training"]["max_len"])
    ds_val = NewsDataset(val_items, tokenizer_name=cfg["model"]["text_model_name"], max_len=cfg["training"]["max_len"])

    dl_train = DataLoader(ds_train, batch_size=cfg["training"]["batch_size"], shuffle=True, collate_fn=collate_fn)
    dl_val = DataLoader(ds_val, batch_size=cfg["training"]["batch_size"], collate_fn=collate_fn)

    device = torch.device("cuda" if torch.cuda.is_available() and cfg["training"]["device"]=="cuda" else "cpu")
    model = BertClassifier(pretrained_model_name=cfg["model"]["text_model_name"], num_labels=cfg["model"]["num_labels"])
    model.to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=float(cfg["training"]["learning_rate"]))
   

    loss_fn = nn.CrossEntropyLoss()

    for epoch in range(cfg["training"]["epochs"]):
        model.train()
        total_loss = 0.0
        for b in dl_train:
            opt.zero_grad()
            input_ids = b["input_ids"].to(device)
            attention_mask = b["attention_mask"].to(device)
            labels = b["labels"].to(device)
            logits = model(input_ids=input_ids, attention_mask=attention_mask)
            loss = loss_fn(logits, labels)
            loss.backward()
            opt.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1} train_loss={total_loss/len(dl_train):.4f}")

        # quick eval
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for b in dl_val:
                input_ids = b["input_ids"].to(device)
                attention_mask = b["attention_mask"].to(device)
                labels = b["labels"].to(device)
                logits = model(input_ids=input_ids, attention_mask=attention_mask)
                preds = logits.argmax(dim=1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)
        print(f"Val acc: {correct/total:.4f}")

        # save checkpoint
        ckpt_dir = ROOT / "checkpoints"
        ckpt_dir.mkdir(exist_ok=True)
        torch.save({"model_state": model.state_dict()}, ckpt_dir / f"bert_epoch{epoch+1}.pt")
    print("Training finished.")

if __name__ == "__main__":
    train()
