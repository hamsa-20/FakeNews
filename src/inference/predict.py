import torch
from src.models.bert_text_classifier import BertClassifier
from src.models.image_cnn import ImageCNN
from src.models.social_gnn import SocialGNN
from src.models.multimodal_fusion import MultimodalFusion

def predict(text, image_path, social_features):
    # Dummy embeddings for now
    text_emb = torch.randn(1, 768)
    image_emb = torch.randn(1, 128)
    social_emb = torch.randn(1, 128)

    fusion_model = MultimodalFusion()
    pred = fusion_model(text_emb, image_emb, social_emb)
    return pred.argmax(dim=1).item()
