import React, { useState } from "react";

function BeatMakerForm() {
  const [mood, setMood] = useState("");
  const [theme, setTheme] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/generate-beat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood, theme }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
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
      <button type="submit">Generate Beat</button>
    </form>
  );
}
export default BeatMakerForm;
