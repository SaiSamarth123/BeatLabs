const fs = require("fs");
const jsmidgen = require("jsmidgen");

function generateMIDI(melody) {
  const file = new jsmidgen.File();
  const track = new jsmidgen.Track();
  file.addTrack(track);

  const tempo = 120;
  const ticksPerBeat = 128;
  const velocity = 100;
  const channel = 0;
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

function saveMIDI(file, outputFilePath) {
  fs.writeFileSync(outputFilePath, file.toBytes(), "binary");
  console.log(`MIDI file saved as ${outputFilePath}`);
}

(async () => {
  const melody = JSON.parse(process.argv[2]);
  const outputFilePath = process.argv[3];
  const instrument = process.argv[4];

  const midiFile = generateMIDI(melody);
  saveMIDI(midiFile, outputFilePath);
})();
