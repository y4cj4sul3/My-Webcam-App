var express = require("express");
var multer = require("multer");
// var path = require("path");
// var fs = require("fs");

var imageController = require("../controllers/ImageController");

var router = express.Router();

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

router.get("/", imageController.getImages);

router.get("/:timestamp", function (req, res, next) {
    // get image at timestamp
    req.query.at = req.params.timestamp;
    imageController.getImages(req, res, next);
});

router.post("/", upload.single("image"), imageController.addImage);

module.exports = router;
