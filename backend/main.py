from fastapi import FastAPI, UploadFile, Form
from pydantic import BaseModel
from src.inference.predict import predict

app = FastAPI()

class NewsItem(BaseModel):
    text: str
    image_path: str
    social_features: list

@app.post("/predict")
async def get_prediction(item: NewsItem):
    result = predict(item.text, item.image_path, item.social_features)
    return {"prediction": result}
