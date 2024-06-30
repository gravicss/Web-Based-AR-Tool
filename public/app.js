document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file first!');
        return; // Exit if no file is selected
    }

    // Assuming you have a server-side endpoint to handle the upload
    const formData = new FormData();
    formData.append('model', file);

    fetch('/upload', { // Modify with your actual upload URL
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('File uploaded successfully!');
            // Enable the submit button and configure its action based on dropdown selection
            const submitButton = document.getElementById('submitBtn');
            const actionDropdown = document.getElementById('actionsDropdown');
            submitButton.style.display = 'block';

            submitButton.addEventListener('click', function() {
                let selectedAction = actionDropdown.value;
                let targetUrl;

                switch (selectedAction) {
                    case 'tapPlace':
                        targetUrl = '/ar-view.html';
                        break;
                    case 'tossObject':
                        targetUrl = '/toss.html';
                        break;
                    case 'manipulate':
                        targetUrl = '/manipulate.html';
                        break;
                    case 'animate':
                        targetUrl = '/change-animation.html';
                        break;
                    case 'hologram':
                        targetUrl = '/hologram/hologram.html';
                        break;
                    default:
                        targetUrl = '/error.html'; // Fallback page
                        break;
                }

                // Clear previous QR Code if exists
                const qrCodeContainer = document.getElementById("qrcode");
                qrCodeContainer.innerHTML = ''; // Clear the QR code container
                document.getElementById("linkDisplay").textContent = '';
                
                // QR Code Generation
                const fullUrl = window.location.origin + targetUrl + '?model=' + data.modelId;
                var qrcode = new QRCode(qrCodeContainer, {
                    text: fullUrl,
                    width: 128,
                    height: 128,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

                // Display the link
                document.getElementById("linkDisplay").textContent = fullUrl;
                document.getElementById("linkDisplay").style.display = 'block';
            });
        } else {
            alert('Upload failed: ' + data.message); // Server should send a message in case of failure
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Upload failed, please try again.');
    });
});
