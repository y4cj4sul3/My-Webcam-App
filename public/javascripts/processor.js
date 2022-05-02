let processor = {
    init: function () {
        this.video = document.getElementById("video");
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.textInput = document.getElementById("text");
        this.captureBtn = document.getElementById("capture-btn");
        this.captureSpin = document.getElementById("captureSpin");
        this.text = "";

        // get camera
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            this.video.srcObject = stream;
        });

        video.addEventListener(
            "play",
            () => {
                // set canvas size
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                // set font
                this.context.font = `${this.canvas.height * 0.2}px Arial`;

                this.timerCallback();
            },
            false
        );
    },

    timerCallback: function () {
        if (this.video.paused || this.video.ended) return;

        // show video
        this.context.drawImage(
            this.video,
            0,
            0,
            this.video.videoWidth,
            this.video.videoHeight
        );
        // add text
        this.context.fillStyle = "red";
        this.context.fillText(this.text, 10, this.canvas.height * 0.95);

        setTimeout(() => {
            this.timerCallback();
        }, 0);
    },

    updateText: function () {
        this.text = this.textInput.value;
    },

    snapshot: function () {
        // update display
        this.captureBtn.disabled = true;
        this.captureSpin.style.display = "compact";

        // convert canvas to image file
        this.canvas.toBlob((blob) => {
            var formData = new FormData();
            formData.append("image", blob);

            // upload to server
            fetch(window.location.origin + "/snapshot/", {
                method: "POST",
                body: formData,
            })
                .catch((err) => {
                    console.log("upload failed", err);
                })
                .finally(() => {
                    // update display
                    this.captureBtn.disabled = false;
                    this.captureSpin.style.display = "none";
                });
        }, "image/png");
    },
};
