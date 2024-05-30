# BeatLabs

This project is a web application that allows users to upload a vocal or hum recording and convert it into an instrumental or beat. The backend is powered by FastAPI and Node.js, while the frontend is built with React.js. 

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload vocal or hum recordings
- Process audio to detect pitch
- Convert recordings to instrumentals/beats
- Download generated MIDI files

## Requirements

- Python 3.8+
- Node.js 14+
- npm 6+
- FastAPI
- Librosa
- Aubio
- Fluent-ffmpeg
- jsmidgen
- React.js

## Installation

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/vocal-to-instrumental.git
    cd vocal-to-instrumental/backend
    ```

2. Create a virtual environment and activate it:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the Python dependencies:

    ```bash
    pip install fastapi uvicorn librosa numpy
    ```

4. Install Node.js dependencies:

    ```bash
    npm install aubio fluent-ffmpeg jsmidgen fs
    ```

5. Create the necessary directories:

    ```bash
    mkdir temp
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install the React.js dependencies:

    ```bash
    npm install
    ```

## Running the Project

### Running the Backend

1. Navigate to the backend directory and start the FastAPI server:

    ```bash
    cd backend
    uvicorn main:app --reload
    ```

### Running the Frontend

1. Navigate to the frontend directory and start the React development server:

    ```bash
    cd frontend
    npm start
    ```

2. Open your browser and go to `http://localhost:3000` to access the application.

## API Endpoints

### POST `/process-audio/`

- Description: Processes an uploaded audio file to detect pitch and analyze its duration.
- Request Body: `multipart/form-data` with a file field named `file`.
- Response: JSON object containing the duration and pitch data.

### POST `/generate-midi/`

- Description: Converts an uploaded audio file to a MIDI file based on the detected melody and selected instrument.
- Request Body: `multipart/form-data` with a file field named `file` and a form field named `instrument`.
- Response: JSON object containing the path to the generated MIDI file.

## Usage

1. Open the web application in your browser.
2. Upload your vocal or hum recording in MP3 format.
3. Select the desired instrument for conversion.
4. Submit the form to process the audio.
5. Download the generated MIDI file from the provided link.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
