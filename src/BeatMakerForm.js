import React, { useState } from "react";

function BeatMakerForm() {
  const [mood, setMood] = useState("");
  const [theme, setTheme] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [instrument, setInstrument] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("instrument", instrument);

    fetch("http://localhost:3001/convert", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted-${instrument}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Mood:
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="energetic">Energetic</option>
        </select>
      </label>
      <br />
      <label>
        Theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="">Select Theme</option>
          <option value="nature">Nature</option>
          <option value="urban">Urban</option>
          <option value="space">Space</option>
        </select>
      </label>
      <br />
      <label>
        Audio File:
        <input type="file" onChange={(e) => setAudioFile(e.target.files[0])} />
      </label>
      <br />
      <label>
        Instrument:
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        >
          <option value="">Select Instrument</option>
          <option value="piano">Piano</option>
          <option value="guitar">Guitar</option>
          {/* Add more instruments as needed */}
        </select>
      </label>
      <br />
      <button type="submit">Convert</button>
    </form>
  );
}
export default BeatMakerForm;
