const fs = require("fs");
const jsmidgen = require("jsmidgen");

// Function to generate MIDI file from melody
function generateMIDI(melody) {
  const file = new jsmidgen.File();
  const track = new jsmidgen.Track();
  file.addTrack(track);

  const tempo = 120; // Beats per minute
  const ticksPerBeat = 128; // MIDI standard
  const velocity = 100; // MIDI velocity
  const channel = 0; // MIDI channel
  let currentTime = 0;

  melody.forEach((note) => {
    const pitch = note.pitch;
    const durationInSeconds = note.duration;
    const durationInTicks = (durationInSeconds * ticksPerBeat * tempo) / 60;
    track.addNote(channel, pitch, currentTime, durationInTicks, velocity);
    currentTime += durationInTicks;
  });

  return file;
}

// Function to save MIDI file
function saveMIDI(file, outputFilePath) {
  fs.writeFileSync(outputFilePath, file.toBytes(), "binary");
  console.log(`MIDI file saved as ${outputFilePath}`);
}

module.exports = { generateMIDI, saveMIDI };
