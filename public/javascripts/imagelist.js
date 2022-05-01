let imagelist = {
    init: function () {
        this.list = document.getElementById("snapshots");
        this.spinner = document.getElementById("snapshotSpin");
        this.imageTemplate = document
            .getElementById("imgTemplate")
            .content.querySelector("img");

        this.apiURL = window.location.origin + "/snapshot/";

        this.lazyLoadLock = false;
        this.requestCount = 0;

        // FIXME: buggy when using mobile
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
                        this.addImage(image);
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

    addImage: function (image) {
        navigator.locks.request("image_list", async (lock) => {
            // check whether the images is add to the list
            let timestamp = image["timestamp"];
            if (document.getElementById(timestamp)) return;

            // create new image
            var img = document.importNode(this.imageTemplate, true);
            img.id = timestamp;
            img.src = "data:image/png;base64," + image["encode"];
            // img.src = window.location.origin + "/images/" + filename;

            // add in sorted order
            if (!this.list.lastChild || img.id < this.list.lastChild.id)
                this.list.append(img);
            else if (img.id > this.list.firstChild.id) this.list.prepend(img);
            else {
                console.log("ddd" + this.list.children.length);
                // binary search insert point
                var l = 0;
                var r = this.list.children.length - 1;
                while (l <= r) {
                    var mid = Math.floor((l + r) / 2);
                    console.log(mid);

                    if (this.list.children[mid].id < img.id) l = mid + 1;
                    else r = mid - 1;
                }
                this.list.insertBefore(img, this.list.children[l]);
                console.log("bs: " + l);
            }
        });
    },
};
