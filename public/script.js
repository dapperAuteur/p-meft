const video = document.getElementById('webcam');
const canvasElement = document.createElement('canvas'); // Create canvas element
document.body.appendChild(canvasElement); // Append canvas to body
const canvasCtx = canvasElement.getContext('2d');

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

pose.onResults(onResults); // Define onResults function later.

const camera = new Camera(video, {
    onFrame: async () => {
        await pose.send({ image: video });
    },
    width: 640,
    height: 480
});

camera.start().catch((error) => {
    console.error('Camera error:', error);
    let errorMessage = 'Error accessing camera. Please check your permissions and connections.';
    if (error.message.includes('Permission denied')) {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
    } else if (error.message.includes('NoMediaFoundError')) {
        errorMessage = 'No camera found. Please check your device and connections.';
    }
    alert(errorMessage);
});

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
    }
    canvasCtx.restore();
}

canvasElement.width = video.videoWidth;
canvasElement.height = video.videoHeight;

const startButton = document.getElementById('startButton');
let isRunning = false;

startButton.addEventListener('click', () => {
    isRunning = !isRunning;
    if (isRunning) {
        startButton.textContent = 'Stop';
        // Add logic to start exercise tracking
    } else {
        startButton.textContent = 'Start';
        // Add logic to stop exercise tracking
    }
});

const colorSchemeSelection = document.getElementById('colorSchemeSelection');
const blueOrangeScheme = document.getElementById('blueOrangeScheme');
const magentaCyanScheme = document.getElementById('magentaCyanScheme');
const blueYellowScheme = document.getElementById('blueYellowScheme');

function setColorScheme(scheme) {
    // Implement logic to change the color scheme
    // For now, let's just log the selection
    console.log('Selected color scheme:', scheme);
    // Save the selection to local storage
    localStorage.setItem('colorScheme', scheme);
    // Hide the color scheme selection div
    colorSchemeSelection.style.display = 'none';
}

blueOrangeScheme.addEventListener('click', () => {
    setColorScheme('blueOrange');
});

magentaCyanScheme.addEventListener('click', () => {
    setColorScheme('magentaCyan');
});

blueYellowScheme.addEventListener('click', () => {
    setColorScheme('blueYellow');
});

// Check for a saved color scheme on page load
const savedColorScheme = localStorage.getItem('colorScheme');
if (savedColorScheme) {
    setColorScheme(savedColorScheme);
}