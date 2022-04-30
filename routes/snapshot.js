var express = require("express");
var router = express.Router();
var multer = require("multer");
// var fs = require("fs");
var ImageModel = require("../models/ImageModel");
// var path = require("path");

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/images");
//     },
//     filename: function (req, file, cb) {
//         // create snapshot id
//         // NOTE: be carefull when create id
//         cb(null, Date.now() + ".png");
//     },
// });

var upload = multer();

router.get("/", function (req, res, next) {
    // TODO: add filter
    // select, order
    console.log("get request");

    ImageModel.getAllImages().then((images) => {
        res.json(images);
    });

    // // get all images
    // fs.readdir("./public/images", (err, files) => {
    //     if (files) {
    //         files.forEach((file) => {
    //             console.log(file);
    //         });
    //     }
    //     res.json(files);
    // });
});

router.get("/:timestamp", function (req, res, next) {
    // get image at timestamp
    console.log("get request: " + req.params.timestamp);
    ImageModel.getImage(req.params.timestamp).then((image) => {
        res.json(image);
    });
});

router.post("/", upload.single("image"), function (req, res, next) {
    // store in database
    // FIXME: transmit with base64 format, maybe faster to transmit but adding encoding/decoding cost on server and database
    const timestamp = Date.now();
    console.log(timestamp);
    ImageModel.uploadImage(timestamp, req.file.buffer.toString("base64")).then(
        () => {
            res.send(`${timestamp}`);
        }
    );
});

module.exports = router;
