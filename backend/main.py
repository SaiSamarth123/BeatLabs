from fastapi import FastAPI, File, UploadFile, HTTPException
import librosa
import numpy as np
from fastapi.responses import JSONResponse
import subprocess
import os

app = FastAPI()

@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        audio_path = f"temp/{file.filename}"
        with open(audio_path, "wb") as audio_file:
            audio_file.write(file.file.read())

        # Load audio file with librosa
        try:
            audio, sr = librosa.load(audio_path, sr=None)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Librosa load error: {str(e)}")
        
        # Example processing: Get the duration of the audio
        duration = librosa.get_duration(y=audio, sr=sr)
        
        # Process audio to detect pitch
        result = subprocess.run(['node', 'audioprocessing.js', audio_path], capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error in audio processing script: {result.stderr}")
        
        pitch_data = result.stdout
        
        return JSONResponse(content={"duration": duration, "pitch_data": pitch_data})
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-midi/")
async def generate_midi(instrument: str, file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        audio_path = f"temp/{file.filename}"
        with open(audio_path, "wb") as audio_file:
            audio_file.write(file.file.read())
        
        # Process audio to detect pitch and generate melody
        result = subprocess.run(['node', 'audioprocessing.js', audio_path], capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error in audio processing script: {result.stderr}")
        
        melody = eval(result.stdout)
        
        # Generate MIDI file from melody
        midi_output_path = f"temp/{os.path.splitext(file.filename)[0]}.mid"
        subprocess.run(['node', 'midiGeneration.js', melody, midi_output_path, instrument])
        
        return JSONResponse(content={"midi_path": midi_output_path})
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
