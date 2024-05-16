from fastapi import FastAPI, File, UploadFile
import librosa
import numpy as np
from fastapi.responses import JSONResponse
import subprocess
import os

app = FastAPI()

@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    # Save the uploaded file
    audio_path = f"temp/{file.filename}"
    with open(audio_path, "wb") as audio_file:
        audio_file.write(file.file.read())
    
    # Load audio file with librosa
    audio, sr = librosa.load(audio_path, sr=None)
    
    # Example processing: Get the duration of the audio
    duration = librosa.get_duration(y=audio, sr=sr)
    
    # Process audio to detect pitch
    result = subprocess.run(['node', 'audioprocessing.js', audio_path], capture_output=True, text=True)
    pitch_data = result.stdout
    
    return JSONResponse(content={"duration": duration, "pitch_data": pitch_data})

@app.post("/generate-midi/")
async def generate_midi(file: UploadFile = File(...), instrument: str):
    # Save the uploaded file
    audio_path = f"temp/{file.filename}"
    with open(audio_path, "wb") as audio_file:
        audio_file.write(file.file.read())
    
    # Process audio to detect pitch and generate melody
    result = subprocess.run(['node', 'audioprocessing.js', audio_path], capture_output=True, text=True)
    melody = eval(result.stdout)
    
    # Generate MIDI file from melody
    midi_output_path = f"temp/{os.path.splitext(file.filename)[0]}.mid"
    subprocess.run(['node', 'midiGeneration.js', melody, midi_output_path, instrument])
    
    return JSONResponse(content={"midi_path": midi_output_path})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
