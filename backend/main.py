from fastapi import FastAPI, File, UploadFile
import librosa
import numpy as np

app = FastAPI()


@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    # Load audio file with librosa
    audio, sr = librosa.load(file.file, sr=None)
    # Example processing: Get the duration of the audio
    duration = librosa.get_duration(y=audio, sr=sr)
    return {"duration": duration}
