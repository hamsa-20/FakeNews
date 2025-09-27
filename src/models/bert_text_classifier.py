import torch
import torch.nn as nn
from transformers import AutoModel

class BertClassifier(nn.Module):
    def __init__(self, pretrained_model_name="bert-base-uncased", num_labels=2, dropout=0.3):
        super().__init__()
        self.bert = AutoModel.from_pretrained(pretrained_model_name)
        hidden = self.bert.config.hidden_size
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(hidden, num_labels)

    def forward(self, input_ids=None, attention_mask=None):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask, return_dict=True)
        pooled = outputs.pooler_output  # [batch, hidden]
        x = self.dropout(pooled)
        logits = self.classifier(x)
        return logits
