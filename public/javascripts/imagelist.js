let imagelist = {
    init: function () {
        this.list = document.getElementById("snapshots");
        this.spinner = document.getElementById("snapshotSpin");
        this.imageTemplate = document
            .getElementById("imgTemplate")
            .content.querySelector("div");

        this.apiURL = window.location.origin + "/snapshot/";

        this.lazyLoadLock = false;
        this.requestCount = 0;

        // scroll to lazy load
        var snapDiv = document.getElementById("snapshots");
        snapDiv.addEventListener("scroll", () => {
            if (
                snapDiv.offsetHeight + snapDiv.scrollTop >=
                snapDiv.scrollHeight
            ) {
                console.log("bot");
                imagelist.lazyLoad();
            }
        });

        // load some images
        this.lazyLoad();
    },
    lazyLoad: function (limit = 5) {
        // to prevent multiple requests
        if (this.lazyLoadLock) return;
        this.lazyLoadLock = true;

        // load n images from the oldest
        // get oldest timestamp
        var from = null;

        if (this.list.lastChild)
            from = parseInt(this.list.lastChild.id, 10) - 1;
        // load images
        this.loadImages({ from, limit }).finally(() => {
            this.lazyLoadLock = false;
        });
    },
    loadLatest: function () {
        // load images from latest to current latest from server
        // NOTE: there must have images loaded in the list

        // only load when there are images loaded or initial lazy load is finished
        if (!this.list.firstChild && this.lazyLoadLock) return;
        // get latest timestamp
        var to = null;
        if (this.list.firstChild)
            to = parseInt(this.list.firstChild.id, 10) + 1;
        // load images
        this.loadImages({ to }, true);
    },
    loadImages: function (query, reverse = false) {
        navigator.locks.request("request_count", async (lock) => {
            if (this.requestCount == 0) this.spinner.style.display = "block";
            this.requestCount += 1;
            console.log("request count: " + this.requestCount);
        });

        // get images from server
        // set query
        var qstr = [];
        for (var k in query) {
            if (query[k]) qstr.push(k + "=" + query[k]);
        }
        var q = "";
        if (qstr.length > 0) q = "?" + qstr.join("&");
        console.log(q);

        // send request to server
        return fetch(this.apiURL + q, {
            method: "GET",
        })
            .then((res) => {
                return res.json().then((images) => {
                    if (reverse) images = images.reverse();
                    console.log(images);
                    // create imgs
                    images.forEach((image) => {
                        this.addImageToList(image);
                    });
                });
            })
            .finally(() => {
                navigator.locks.request("request_count", async (lock) => {
                    this.requestCount -= 1;
                    if (this.requestCount == 0)
                        this.spinner.style.display = "none";
                    console.log("request count: " + this.requestCount);
                });
            });
    },

    addImageToList: function (image) {
        navigator.locks.request("image_list", async (lock) => {
            // check whether the images is add to the list
            let timestamp = image["timestamp"];
            if (document.getElementById(timestamp)) return;

            // create new image
            var imgDiv = document.importNode(this.imageTemplate, true);
            imgDiv.id = timestamp;
            let img = imgDiv.querySelector("img");
            img.src = "data:image/png;base64," + image["encode"];
            // img.src = window.location.origin + "/images/" + filename;

            // add in sorted order
            if (!this.list.lastChild || imgDiv.id < this.list.lastChild.id)
                this.list.append(imgDiv);
            else if (imgDiv.id > this.list.firstChild.id)
                this.list.prepend(imgDiv);
            else {
                // binary search insert point
                var l = 0;
                var r = this.list.children.length - 1;
                while (l <= r) {
                    var mid = Math.floor((l + r) / 2);

                    if (this.list.children[mid].id < imgDiv.id) l = mid + 1;
                    else r = mid - 1;
                }
                this.list.insertBefore(imgDiv, this.list.children[l]);
                console.log("bs: " + l);
            }
        });
    },
    deleteImage: function (btn) {
        var timestamp = btn.parentElement.id;
        console.log(timestamp);

        // delete image element (local)
        btn.parentElement.remove();

        // remove from server database
        fetch(this.apiURL + timestamp, { method: "DELETE" }).then((res) => {
            res.text().then((log) => console.log(log));
        });
    },
    deleteImageFromList: function (timestamp) {
        var imgDiv = document.getElementById(timestamp);
        if (imgDiv) imgDiv.remove();
        // lazy load if current list has not enough images for it to scroll
        if (this.list.children.length < 5) this.lazyLoad();
    },
};
