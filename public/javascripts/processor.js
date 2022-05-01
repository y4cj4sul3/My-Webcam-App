let processor = {
    doLoad: function () {
        this.video = document.getElementById("video");
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.textInput = document.getElementById("text");
        this.imgList = document.getElementById("snapshots");
        this.text = "";

        // load images
        this.loadImages();

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
                // TODO: flex set font
                this.context.font = "100% Arial";

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
        this.context.fillText(this.text, 10, 50);

        setTimeout(() => {
            this.timerCallback();
        }, 0);
    },

    updateText: function () {
        this.text = this.textInput.value;
    },

    snapshot: function () {
        // convert canvas to image file
        this.canvas.toBlob((blob) => {
            var formData = new FormData();
            formData.append("image", blob);

            // upload to server
            fetch(window.location.origin + "/snapshot/", {
                method: "POST",
                body: formData,
            }).then((res) => {
                res.text().then((timestamp) => {
                    console.log(timestamp);
                    // this.addImage(filename);
                });
            });
        }, "image/png");
    },

    loadImages: function () {
        // get image from server
        fetch(window.location.origin + "/snapshot/", {
            method: "GET",
        }).then((res) => {
            res.json().then((images) => {
                console.log(images);
                // create imgs
                images.forEach((image) => {
                    this.addImage(image["encode"]);
                });
            });
        });
    },
    loadSingleImage: function (timestamp) {
        fetch(window.location.origin + "/snapshot/" + timestamp, {
            method: "GET",
        }).then((res) => {
            res.json().then((image) => {
                console.log(image);
                this.addImage(image[0]["encode"]);
            });
        });
    },
    addImage: function (image) {
        var img = document.createElement("img");
        // img.src = window.location.origin + "/images/" + filename;
        img.src = "data:image/png;base64," + image;
        this.imgList.prepend(img);
    },
};

document.addEventListener("DOMContentLoaded", () => {
    processor.doLoad();

    // setup websocket
    var HOST = location.origin.replace(/^http/, "ws");
    this.ws = new WebSocket(HOST);
    this.ws.onmessage = function (event) {
        // add new image
        processor.loadSingleImage(event.data);
    };
});
