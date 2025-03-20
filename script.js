const video = document.getElementById('webcam');

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.error('Error accessing webcam:', error);
            alert('Unable to access webcam. Please check your permissions.');
        });
} else {
    alert('getUserMedia is not supported on this browser.');
}