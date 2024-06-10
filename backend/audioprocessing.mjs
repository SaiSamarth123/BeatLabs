import fs from 'fs';

import ffmpeg from 'fluent-ffmpeg';
import { Lame } from 'node-lame';
import decode from 'audio-decode';
import { YIN } from 'pitchfinder';

async function detectPitch(audioPath) {
  const audioBuffer = fs.readFileSync(audioPath);
  return new Promise((resolve, reject) => {
    decode(audioBuffer)
      .then((audioData) => {
        console.log('Decoded Audio Data:', audioData);

        if (!audioData || !audioData.channelData || !audioData.channelData[0]) {
          return reject(new Error('Invalid audio data'));
        }

        const detectPitch = new YIN();
        const pitches = [];

        // Sample every 2048 frames for pitch detection
        for (let i = 0; i < audioData.channelData[0].length; i += 2048) {
          const sample = audioData.channelData[0].slice(i, i + 2048);
          const pitch = detectPitch(sample);
          if (pitch) pitches.push(pitch);
        }

        resolve(pitches);
      })
      .catch(err => {
        console.error('Error decoding audio:', err);
        reject(err);
      });
  });
}

async function preprocessAudio(audioPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(audioPath)
      .audioFilters('volume=0.5')
      .output(outputAudioPath)
      .on('end', () => {
        console.log('Audio preprocessing complete');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error preprocessing audio:', err);
        reject(err);
      })
      .run();
  });
}

(async () => {
  const startTime = Date.now();
  try {
    const audioPath = process.argv[2];
    console.log(`Processing audio file at: ${audioPath}`);
    const pitchData = await detectPitch(audioPath);
    console.log(`Detected pitch data: ${JSON.stringify(pitchData)}`);
  } catch (err) {
    console.error('Error in audioprocessing.mjs:', err);
    process.exit(1); // Exit with an error code
  } finally {
    const endTime = Date.now();
    console.log(`Pitch detection processing time: ${(endTime - startTime) / 1000} seconds`);
  }
})();
