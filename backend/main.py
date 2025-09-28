# from fastapi import FastAPI, UploadFile, Form
# from pydantic import BaseModel
# from src.inference.predict import predict

# app = FastAPI()

# class NewsItem(BaseModel):
#     text: str
#     image_path: str
#     social_features: list

# @app.post("/predict")
# async def get_prediction(item: NewsItem):
#     result = predict(item.text, item.image_path, item.social_features)
#     return {"prediction": result}
# @app.get("/")
# def home():
#     return {"message": "Backend is running!"}
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import uvicorn
import json
import os
import shutil
from pathlib import Path

app = FastAPI(title="Multi-Modal Fake News Detection API", version="2.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

class PredictionRequest(BaseModel):
    text: str
    models: Optional[List[str]] = ["twitter", "mediaeval", "socialcontext"]

class ModelPrediction(BaseModel):
    prediction: str
    confidence: float

class PredictionResponse(BaseModel):
    predictions: dict[str, ModelPrediction]
    timestamp: str
    analyzed_files: Optional[List[str]] = []

# Mock prediction functions
def mock_predict_text(text: str, model: str) -> ModelPrediction:
    """Mock text prediction - replace with your actual model"""
    import random
    
    fake_indicators = ['breaking', 'exclusive', 'shocking', 'unbelievable', 'must read']
    real_indicators = ['according to', 'study shows', 'research indicates', 'experts say']
    
    text_lower = text.lower()
    fake_score = sum(1 for indicator in fake_indicators if indicator in text_lower)
    real_score = sum(1 for indicator in real_indicators if indicator in text_lower)
    
    if fake_score > real_score:
        prediction = "fake"
        confidence = min(0.9, 0.6 + (fake_score * 0.1) + random.uniform(0, 0.2))
    elif real_score > fake_score:
        prediction = "real" 
        confidence = min(0.9, 0.6 + (real_score * 0.1) + random.uniform(0, 0.2))
    else:
        prediction = random.choice(["real", "fake"])
        confidence = random.uniform(0.5, 0.8)
    
    return ModelPrediction(prediction=prediction, confidence=confidence)

def mock_predict_image(image_path: str, model: str) -> ModelPrediction:
    """Mock image prediction - replace with your actual vision model"""
    import random
    
    # Mock analysis based on file size (larger files might be more suspicious)
    file_size = os.path.getsize(image_path)
    
    if file_size > 5_000_000:  # 5MB+
        prediction = "fake"
        confidence = random.uniform(0.7, 0.9)
    elif file_size < 100_000:  # < 100KB
        prediction = "fake"
        confidence = random.uniform(0.6, 0.8)
    else:
        prediction = "real"
        confidence = random.uniform(0.6, 0.9)
    
    return ModelPrediction(prediction=prediction, confidence=confidence)

def mock_predict_document(doc_path: str, model: str) -> ModelPrediction:
    """Mock document prediction - replace with your actual document analysis model"""
    import random
    
    # Mock analysis based on file extension
    extension = Path(doc_path).suffix.lower()
    
    if extension == '.pdf':
        prediction = random.choice(["real", "fake"])
        confidence = random.uniform(0.6, 0.8)
    else:
        prediction = random.choice(["real", "fake"])
        confidence = random.uniform(0.5, 0.7)
    
    return ModelPrediction(prediction=prediction, confidence=confidence)

def analyze_uploaded_file(file_path: str, model: str) -> ModelPrediction:
    """Route file to appropriate analysis function"""
    extension = Path(file_path).suffix.lower()
    
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    document_extensions = ['.pdf', '.doc', '.docx', '.txt']
    
    if extension in image_extensions:
        return mock_predict_image(file_path, model)
    elif extension in document_extensions:
        return mock_predict_document(file_path, model)
    else:
        # Default to document analysis for unknown types
        return mock_predict_document(file_path, model)

@app.get("/")
async def root():
    return {"message": "Multi-Modal Fake News Detection API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.now().isoformat()}

@app.post("/predict", response_model=PredictionResponse)
async def predict_news(request: PredictionRequest):
    """Text-only prediction endpoint"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(request.text) < 10:
            raise HTTPException(status_code=400, detail="Text too short for analysis")
        
        predictions = {}
        
        for model in request.models:
            if model not in ["twitter", "mediaeval", "socialcontext"]:
                raise HTTPException(status_code=400, detail=f"Invalid model: {model}")
            
            prediction = mock_predict_text(request.text, model)
            predictions[model] = prediction
        
        return PredictionResponse(
            predictions=predictions,
            timestamp=datetime.datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-multimodal", response_model=PredictionResponse)
async def predict_multimodal(
    text: str = Form(""),
    models: str = Form(...),
    files: List[UploadFile] = File([])
):
    """Multi-modal prediction endpoint for text + files"""
    try:
        models_list = json.loads(models) if models else ["twitter", "mediaeval", "socialcontext"]
        
        if not text.strip() and not files:
            raise HTTPException(status_code=400, detail="Either text or files must be provided")
        
        predictions = {}
        analyzed_files = []
        
        # Process text if provided
        if text.strip():
            for model in models_list:
                if model not in ["twitter", "mediaeval", "socialcontext"]:
                    raise HTTPException(status_code=400, detail=f"Invalid model: {model}")
                
                text_prediction = mock_predict_text(text, model)
                predictions[f"{model}_text"] = text_prediction
        
        # Process uploaded files
        for file in files:
            if file.filename:
                # Save uploaded file
                file_path = UPLOAD_DIR / f"{datetime.datetime.now().timestamp()}_{file.filename}"
                
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                
                analyzed_files.append(file.filename)
                
                # Analyze file with each selected model
                for model in models_list:
                    file_prediction = analyze_uploaded_file(str(file_path), model)
                    predictions[f"{model}_{file.filename}"] = file_prediction
                
                # Clean up uploaded file after analysis
                # os.remove(file_path)  # Uncomment if you want to delete files after analysis
        
        return PredictionResponse(
            predictions=predictions,
            timestamp=datetime.datetime.now().isoformat(),
            analyzed_files=analyzed_files
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/supported-formats")
async def get_supported_formats():
    """Return supported file formats"""
    return {
        "images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
        "documents": [".pdf", ".doc", ".docx", ".txt"],
        "videos": [".mp4", ".avi", ".mov", ".wmv", ".flv"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)