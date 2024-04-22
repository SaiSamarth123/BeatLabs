const express = require("express");
const multer = require("multer");
const fs = require("fs");
const aubio = require("aubio");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3001;

app.use(express.json());

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

// Function to preprocess audio using ffmpeg
async function preprocessAudio(audioPath, outputAudioPath) {
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
app.post("/convert", upload.single("audio"), (req, res) => {
  const audioPath = req.file.path;

  // Load audio file into memory
  const audioBuffer = fs.readFileSync(audioPath);

  // Energy-based onset detection parameters
  const bufferSize = 512;
  const hopSize = bufferSize / 2;
  const threshold = 1.5;

  // Create aubio source
  const source = new aubio.source(audioPath, 0, audioBuffer.length);
  const energy = new aubio.mfcc(bufferSize, bufferSize / 2, source.channels);
  const onset = new aubio.onset(
    "energy",
    bufferSize,
    hopSize,
    source.samplerate
  );

  // Process audio and detect onsets
  let onsetArray = [];
  while (source.read(bufferSize) > 0) {
    const frame = source.getFloatBuffer(bufferSize);
    const frameEnergy = energy.do(frame);
    const isOnset = onset.do(frame);

    if (isOnset && frameEnergy > threshold) {
      const timestamp = (onsetArray.length * hopSize) / source.samplerate;
      onsetArray.push(timestamp);
    }
  }

  console.log("Onset Array:", onsetArray);

  // Return response
  res.json({ onsetArray });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
