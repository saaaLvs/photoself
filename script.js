      var video = document.getElementById("video");
      var captureBtn = document.getElementById("capture-btn");
      var photosContainer = document.getElementById("photos");
      var timerInput = document.getElementById("timer");

      // Access the camera and stream to video
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
      });

      // Capture photo with timer
      captureBtn.addEventListener("click", () => {
        var timer = timerInput.value - 1;
        if (timer > 0) {
          captureBtn.disabled = true;
          var countdown = setInterval(() => {
            captureBtn.textContent = `Capture (${timer})`;
            if (timer <= 0) {
              clearInterval(countdown);
              captureBtn.textContent = "Capture";
              captureBtn.disabled = false;
              capturePhoto();
            }
            timer--;
          }, 1000);
        } else {
          capturePhoto();
        }
      });

      function capturePhoto() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL("image/png");

        // Create image list from captured photo
        var photoDiv = document.createElement("div");
        photoDiv.classList.add("photo");

        var img = document.createElement("img");
        img.src = dataURL;
        photoDiv.appendChild(img);

        // Create download image feature
        var downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        downloadBtn.addEventListener("click", () => {
          var a = document.createElement("a");
          a.href = dataURL;
          a.download = "photo.png";
          a.click();
        });

        photoDiv.appendChild(downloadBtn);
        photosContainer.appendChild(photoDiv);
      }