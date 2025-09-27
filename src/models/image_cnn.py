import torch
import torch.nn as nn
import torchvision.models as models

class ImageCNN(nn.Module):
    def __init__(self, output_dim=128):
        super().__init__()
        base_model = models.resnet18(pretrained=True)
        self.feature_extractor = nn.Sequential(*list(base_model.children())[:-1])  # Remove last FC
        self.fc = nn.Linear(base_model.fc.in_features, output_dim)

    def forward(self, x):
        features = self.feature_extractor(x)
        features = features.view(features.size(0), -1)
        return self.fc(features)
