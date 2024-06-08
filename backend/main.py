from fastapi import FastAPI, File, UploadFile, HTTPException
import subprocess
import os
import time

app = FastAPI()

@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    start_time = time.time()
    try:
        # Save the uploaded file
        audio_path = f"temp/{file.filename}"
        with open(audio_path, "wb") as audio_file:
            audio_file.write(file.file.read())
        print(f"Uploaded file saved at: {audio_path}")

        # Convert audio to WAV format using FFmpeg
        wav_path = f"temp/{os.path.splitext(file.filename)[0]}.wav"
        result = subprocess.run(['ffmpeg', '-i', audio_path, wav_path], capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error converting audio file: {result.stderr}")
        print(f"Audio file converted to WAV format at: {wav_path}")

        # Process audio to detect pitch
        result = subprocess.run(['node', 'audioprocessing.mjs', wav_path], capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error in audio processing script: {result.stderr}")
        print(f"Pitch detection output: {result.stdout}")

        pitch_data = result.stdout

        end_time = time.time()
        print(f"Total processing time: {end_time - start_time} seconds")

        return {"pitch_data": pitch_data}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)