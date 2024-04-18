const express = require("express");
const app = express();
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

app.post("/generate-beat", (req, res) => {
  const { mood, theme } = req.body;
  console.log(`Received request for mood: ${mood}, theme: ${theme}`);

  // Here, integrate your Python AI logic or any other logic to generate the beat
  // For demonstration, we'll just send a mock response
  res.json({
    success: true,
    message: `Beat generated for mood: ${mood}, theme: ${theme}`,
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
