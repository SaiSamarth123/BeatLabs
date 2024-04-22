const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { detectPitch, preprocessAudio } = require("./audioProcessing");
const { generateMIDI, saveMIDI } = require("./midiGeneration");

const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3001;

app.use(express.json());

// Route to handle pitch detection
app.post("/detectpitch", upload.single("audio"), async (req, res) => {
  try {
    const pitchArray = await detectPitch(req.file.path);
    res.json({ pitchArray });
  } catch (error) {
    console.error("Error detecting pitch:", error);
    res.status(500).json({ error: "Error detecting pitch" });
  }
});

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
    console.error("Error preprocessing audio:", error);
    res.status(500).json({ error: "Error preprocessing audio" });
  }
});

// Route to handle beat generation and melody extraction
app.post("/convert", upload.single("audio"), async (req, res) => {
  const audioPath = req.file.path;

  try {
    // Detect pitch in the audio
    const pitchArray = await detectPitch(audioPath);

    // Process audio for onset detection (if needed)

    // Extract melody from pitch data (if needed)
    const melody = []; // Placeholder, implement your melody extraction logic

    // Generate MIDI file from melody
    const file = generateMIDI(melody);

    // Save MIDI file
    const outputFilePath = "output.mid";
    saveMIDI(file, outputFilePath);

    res.json({ message: "Conversion complete", outputFilePath });
  } catch (error) {
    console.error("Error converting audio:", error);
    res.status(500).json({ error: "Error converting audio" });
  } finally {
    // Clean up uploaded file
    fs.unlinkSync(audioPath);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
