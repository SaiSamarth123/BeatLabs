const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3001; // Ensure this port is different from your React app's port

app.use(express.json()); // Middleware to parse JSON bodies

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
