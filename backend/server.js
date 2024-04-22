const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3001; // Ensure this port is different from your React app's port

app.use(express.json()); // Middleware to parse JSON bodies

const aubio = require("aubio");

// Function to detect pitch in audio
function detectPitch(audioBuffer) {
  const pitchDetection = new aubio.Pitch("default", 2048, 256, 44100);
  pitchDetection.start();

  const pitchArray = [];
  for (let i = 0; i < audioBuffer.length; i += 2048) {
    const chunk = audioBuffer.slice(i, i + 2048);
    pitchDetection.write(chunk);
    const pitch = pitchDetection.read();
    pitchArray.push(pitch);
  }

  pitchDetection.end();

  return pitchArray;
}

// Route to handle pitch detection
app.post("/detectpitch", upload.single("audio"), (req, res) => {
  const audioBuffer = fs.readFileSync(req.file.path);
  const pitchArray = detectPitch(audioBuffer);

  res.json({ pitchArray });
});
s;

const ffmpeg = require("fluent-ffmpeg");

// Function to preprocess audio using ffmpeg
function preprocessAudio(audioPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(audioPath)
      .audioFilters("volume=0.5") // Apply audio normalization
      .output(outputAudioPath)
      .on("end", () => {
        console.log("Audio preprocessing complete");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error preprocessing audio:", err);
        reject(err);
      })
      .run();
  });
}

// Route to handle audio preprocessing
app.post("/preprocess", upload.single("audio"), async (req, res) => {
  const audioPath = req.file.path;
  const outputAudioPath = `${audioPath}_preprocessed.wav`;

  try {
    await preprocessAudio(audioPath, outputAudioPath);
    res.json({
      message: "Audio preprocessing complete",
      preprocessedAudio: outputAudioPath,
    });
  } catch (error) {
    res.status(500).json({ error: "Error preprocessing audio" });
  }
});
// Route to handle beat generation
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/convert", upload.single("audio"), (req, res) => {
  const audioPath = req.file.path;
  const instrument = req.body.instrument;

  // Placeholder for conversion function
  // convertAudio(audioPath, instrument, outputPath => {
  //     res.download(outputPath, 'converted-audio.mp3', (err) => {
  //         if (err) throw err;
  //         // Optionally delete the temporary files
  //     });
  // });

  // For demonstration, immediately return the uploaded file without conversion
  res.download(audioPath, "converted-audio.mp3", (err) => {
    if (err) throw err;
    fs.unlinkSync(audioPath); // Clean up the uploaded file
  });
});
// Load necessary modules
const fs = require("fs");
const { exec } = require("child_process");
const aubio = require("aubio");

// Load audio file into memory
const audioFilePath = "path_to_audio_file.wav";
const audioBuffer = fs.readFileSync(audioFilePath);

// Create aubio source
const source = new aubio.source(audioFilePath, 0, audioBuffer.length);

// Energy-based onset detection parameters
const bufferSize = 512; // Size of the audio buffer for analysis
const hopSize = bufferSize / 2; // Hop size for moving window
const threshold = 1.5; // Energy threshold for onset detection (adjust as needed)

// Initialize energy and onset detection
const energy = new aubio.mfcc(bufferSize, bufferSize / 2, source.channels);
const onset = new aubio.onset("energy", bufferSize, hopSize, source.samplerate);

// Process audio and detect onsets
let onsetArray = [];
while (source.read(bufferSize) > 0) {
  const frame = source.getFloatBuffer(bufferSize);
  const frameEnergy = energy.do(frame);
  const isOnset = onset.do(frame);

  if (isOnset && frameEnergy > threshold) {
    const timestamp = (onsetArray.length * hopSize) / source.samplerate; // Convert to seconds
    onsetArray.push(timestamp);
  }
}

console.log("Onset Array:", onsetArray);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
