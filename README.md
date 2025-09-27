# Multimodal Fake News Detection

A multimodal fake news detection system combining text, images, and social media features using advanced fusion techniques for accurate misinformation identification. The backend is built with FastAPI, and model training uses PyTorch.

---

## Setup

### Clone Repository

git clone <your-repo-url>
cd multimodal-fake-news-detection


### Create and Activate Virtual Environment

python -m venv venv

For Windows: venv\Scripts\activate

For macOS/Linux: source venv/bin/activate

### Install Dependencies

pip install -r requirements.txt

---

## Dataset Preparation

### Option 1: Dummy / Test Data  
Create dummy `.jsonl` files with structure like:

{"text": "This is fake news example.", "image_path": "data/samples/sample.jpg", "social_features": ["100", "50", "10"], "label": 0}
{"text": "This is real news example.", "image_path": "data/samples/sample2.jpg", "social_features": ["200", "70", "20"], "label": 1}

Place files in:
data/raw/Twitter/twitter.jsonl
data/raw/MediaEval/mediaeval.jsonl
data/raw/SocialContext/socialcontext.jsonl

### Option 2: Real Data  
- Twitter / FakeNewsNet: Download from [Kaggle](https://kaggle.com). Place in `data/raw/Twitter/`.
- MediaEval: Register and download dataset; place in `data/raw/MediaEval/`.
- SocialContext: Download from [official sources](https://github.com/). Place in `data/raw/SocialContext/`.

---

## Preprocessing

Run preprocessing scripts to convert raw data into processed datasets:

python -m src.data.preprocess_twitter
python -m src.data.preprocess_mediaeval
python -m src.data.preprocess_socialcontext
python -m src.data.preprocess_fake_newsnet


Processed data will be saved in `data/processed/`.

---

## Training

Train the text model: 
python -m src.train.train_text

Make sure to set proper hyperparameters (batch size, epochs, learning rate) in your config (`cfg.yaml`).

---

## Running the Backend API

Start the FastAPI server:
uvicorn backend.main:app --reload

Access the API at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---
