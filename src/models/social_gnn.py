import torch
import torch.nn as nn
import torch_geometric.nn as pyg_nn

class SocialGNN(nn.Module):
    def __init__(self, input_dim, hidden_dim=64, output_dim=128):
        super().__init__()
        self.conv1 = pyg_nn.GCNConv(input_dim, hidden_dim)
        self.conv2 = pyg_nn.GCNConv(hidden_dim, output_dim)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index)
        return x.mean(dim=0)  # Graph-level embedding
