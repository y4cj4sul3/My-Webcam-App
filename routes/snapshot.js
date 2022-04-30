var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        // create snapshot id
        // NOTE: be carefull when create id
        cb(null, Date.now() + ".png");
    },
});

var upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
    // TODO: add filter
    // select, order

    // get all images
    fs.readdir("./public/images", (err, files) => {
        files.forEach((file) => {
            console.log(file);
        });
        res.json(files);
    });
});

router.post("/", upload.single("image"), function (req, res, next) {
    // console.log(req.file.filename);
    // var url = 'http://' + req.headers.host + '/images/' + req.file.filename
    res.send(req.file.filename);
});

module.exports = router;
