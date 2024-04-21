const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3001; // Ensure this port is different from your React app's port

app.use(express.json()); // Middleware to parse JSON bodies
// server.jconst aubio = require('aubio');

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
