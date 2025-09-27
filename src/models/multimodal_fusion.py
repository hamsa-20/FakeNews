import torch
import torch.nn as nn

class MultimodalFusion(nn.Module):
    def __init__(self, text_dim=768, image_dim=128, social_dim=128, hidden_dim=256, num_labels=2):
        super().__init__()
        self.fc1 = nn.Linear(text_dim + image_dim + social_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, num_labels)
        self.relu = nn.ReLU()

    def forward(self, text_emb, image_emb, social_emb):
        x = torch.cat([text_emb, image_emb, social_emb], dim=1)
        x = self.relu(self.fc1(x))
        return self.fc2(x)
