const finalCanvas = document.getElementById("finalCanvas");
const ctx = finalCanvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const colorButtons = document.querySelectorAll(".color-btn");

let selectedFrameColor = "img/nude.png"; // Default frame

let capturedPhotos = JSON.parse(sessionStorage.getItem("capturedPhotos")) || [];

if (capturedPhotos.length === 0) {
    console.error("No photos found in sessionStorage.");
}

// Canvas dimensions
const canvasWidth = 240;
const imageHeight = 160;
const spacing = 10;
const framePadding = 10;
const logoSpace = 100;

finalCanvas.width = canvasWidth;
finalCanvas.height = framePadding + (imageHeight + spacing) * capturedPhotos.length + logoSpace;

// Load the custom font first
const fontFace = new FontFace('Sour Gummy', 'url(fonts/SourGummy.ttf)');

fontFace.load().then(function(loadedFont) {
    // Add the loaded font to the document
    document.fonts.add(loadedFont);
    // Initial drawing after font is loaded
    drawCollage();
}).catch(function(error) {
    console.error('Font loading failed:', error);
    // Fallback to default font if loading fails
    drawCollage();
});

// Function to draw the collage
function drawCollage() {
    const background = new Image();
    background.src = selectedFrameColor;

    background.onload = () => {
        ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(background, 0, 0, finalCanvas.width, finalCanvas.height);

        capturedPhotos.forEach((photo, index) => {
            const img = new Image();
            img.src = photo;

            img.onload = () => {
                const x = framePadding;
                const y = framePadding + index * (imageHeight + spacing);
                ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight);
            };

            img.onerror = () => console.error(`Failed to load image ${index + 1}`);
        });

        // Draw the logo immediately after the background
        drawLogo();
    };

    background.onerror = () => console.error("Failed to load background image.");
}

// Updated function to draw the text logo with Sour Gummy font
function drawLogo() {
    const logoY = finalCanvas.height - logoSpace + 35;
    
    // Set the text styling for 'photo' part with Sour Gummy font
    ctx.font = "bold 18px 'Sour Gummy', Arial";
    ctx.fillStyle = "#991B1B"; // text-red-800
    ctx.textAlign = "right";
    
    // Calculate the center point
    const centerX = finalCanvas.width / 2;
    
    // Draw 'photo' part
    ctx.fillText("'photo", centerX, logoY);

    
    // Draw underline for 'photo'
    const photoWidth = ctx.measureText("'photo").width;
    const photoStartX = centerX - photoWidth;
    ctx.beginPath();
    ctx.strokeStyle = "#991B1B"; // text-red-800
    ctx.lineWidth = 1;
    ctx.moveTo(photoStartX, logoY + 2);
    ctx.lineTo(centerX, logoY + 2);
    ctx.stroke();
    
    // Set the text styling for 'story' part
    ctx.fillStyle = "#1E40AF"; // text-blue-800
    ctx.textAlign = "left";

    
    // Draw 'story' part
    ctx.fillText("story'", centerX, logoY);
    
    // Draw underline for 'story'
    const storyWidth = ctx.measureText("story'").width;
    ctx.beginPath();
    ctx.strokeStyle = "#1E40AF"; // text-blue-800
    ctx.lineWidth = 1;
    ctx.moveTo(centerX, logoY + 2);
    ctx.lineTo(centerX + storyWidth, logoY + 2);
    ctx.stroke();
}

// Change frame color and redraw instantly
colorButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        selectedFrameColor = event.target.getAttribute("data-color");
        drawCollage();
    });
});

// Download the final image
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = finalCanvas.toDataURL("image/png");
    link.download = "my-photostory.png";
    link.click();
});

// We don't call drawCollage() here anymore, as we call it after the font loads