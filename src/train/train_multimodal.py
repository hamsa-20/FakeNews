import torch
from src.models.bert_text_classifier import BertClassifier
from src.models.image_cnn import ImageCNN
from src.models.social_gnn import SocialGNN
from src.models.multimodal_fusion import MultimodalFusion
from src.utils.helpers import get_text_embeddings, get_image_embeddings, get_social_embeddings
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent.parent
with open(ROOT / "config.yaml") as f:
    cfg = yaml.safe_load(f)

def train():
    # Load models
    text_model = BertClassifier(pretrained_model_name=cfg["model"]["text_model_name"], num_labels=cfg["model"]["num_labels"])
    image_model = ImageCNN()
    social_model = SocialGNN(input_dim=10)  # adjust input_dim as per social features
    fusion_model = MultimodalFusion()

    # Optimizer
    opt = torch.optim.AdamW(fusion_model.parameters(), lr=cfg["training"]["learning_rate"])
    loss_fn = torch.nn.CrossEntropyLoss()

    # Example training loop (pseudo)
    for epoch in range(cfg["training"]["epochs"]):
        # get embeddings
        text_emb = get_text_embeddings(text_model)
        image_emb = get_image_embeddings(image_model)
        social_emb = get_social_embeddings(social_model)
        labels = torch.tensor([0,1])  # dummy labels

        preds = fusion_model(text_emb, image_emb, social_emb)
        loss = loss_fn(preds, labels)
        loss.backward()
        opt.step()
        opt.zero_grad()
        print(f"Epoch {epoch}: loss={loss.item()}")

if __name__ == "__main__":
    train()
