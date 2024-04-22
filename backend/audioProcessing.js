const fs = require("fs");
const aubio = require("aubio");
const ffmpeg = require("fluent-ffmpeg");

// Function to detect pitch in audio
async function detectPitch(audioPath) {
  const audioBuffer = fs.readFileSync(audioPath);

  return new Promise((resolve, reject) => {
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

    resolve(pitchArray);
  });
}

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

module.exports = { detectPitch, preprocessAudio };
