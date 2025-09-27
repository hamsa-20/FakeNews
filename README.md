<<<<<<< HEAD
# Multimodal Fake News Detection

This project implements a **multimodal fake news detection system** using text, images, and social context features. The backend is built with **FastAPI**, and training is done using **PyTorch**.  

---

## Project Structure

multimodal-fake-news-detection/
│
├── data/
│ ├── raw/ # Place your raw datasets here
│ │ ├── Twitter/
│ │ │ └── twitter.jsonl
│ │ ├── MediaEval/
│ │ │ └── mediaeval.jsonl
│ │ └── SocialContext/
│ │ └── socialcontext.jsonl
│ └── processed/ # Processed datasets will be saved here
│
├── src/
│ ├── data/ # Scripts for preprocessing & downloading datasets
│ │ ├── preprocess_twitter.py
│ │ ├── preprocess_mediaeval.py
│ │ ├── preprocess_socialcontext.py
│ │ └── preprocess_fake_newsnet.py
│ ├── train/ # Training scripts
│ │ └── train_text.py
│ └── inference/ # Scripts for prediction
│ └── predict.py
│
├── backend/
│ └── main.py # FastAPI backend server
│
├── venv/ # Python virtual environment
├── requirements.txt # Python dependencies
└── README.md

yaml
Copy code

---

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd multimodal-fake-news-detection
Create and activate a Python virtual environment:

bash
Copy code
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Dataset Preparation
Option 1: Dummy/Test Data
If real datasets are not available, create dummy .jsonl files with the following structure:

json
Copy code
{"text": "This is a fake news example.", "image_path": "data/samples/sample.jpg", "social_features": ["100", "50", "10"], "label": 0}
{"text": "This is a real news example.", "image_path": "data/samples/sample2.jpg", "social_features": ["200", "70", "20"], "label": 1}
Place the files in:

bash
Copy code
data/raw/Twitter/twitter.jsonl
data/raw/MediaEval/mediaeval.jsonl
data/raw/SocialContext/socialcontext.jsonl
Option 2: Real Data
Twitter / FakeNewsNet: Download from Kaggle. Extract CSV/JSONL files and place them in data/raw/Twitter/.

MediaEval: Register and download the dataset (usually JSON/CSV) and place it in data/raw/MediaEval/.

SocialContext: Download from GitHub or official source and place it in data/raw/SocialContext/.

Preprocessing
Run the preprocessing scripts to convert raw data into processed JSONL files:

bash
Copy code
# Twitter
python -m src.data.preprocess_twitter

# MediaEval
python -m src.data.preprocess_mediaeval

# SocialContext
python -m src.data.preprocess_socialcontext

# FakeNewsNet
python -m src.data.preprocess_fake_newsnet
After this, processed datasets will appear in data/processed/.

Training
Train the text model using:

bash
Copy code
python -m src.train.train_text
Make sure cfg.yaml (or your config file) has correct parameters for batch size, epochs, learning rate, etc.

Running the Backend API
Start the FastAPI server:

bash
Copy code
uvicorn backend.main:app --reload
Access the API at: http://127.0.0.1:8000
=======
# MultimodelFakeNews
A multimodal fake news detection system that combines text, image, and social media data using advanced feature fusion techniques for accurate and robust misinformation identification.
>>>>>>> 9e633db8279a34d683fa8053e30139344ad3b685
