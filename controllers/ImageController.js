var imageModel = require("../models/ImageModel");
var wws = require("../socket");
// var fs = require("fs");

const getImages = (req, res, next) => {
    // filter
    let from = req.query.from;
    let to = req.query.to;
    let at = req.query.at;
    let limit = req.query.limit;

    console.log(`get request: from ${from} to ${to} at ${at} limit ${limit}`);

    imageModel.getImages(from, to, at, limit).then((images) => {
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
};

const addImage = (req, res, next) => {
    // store in database
    // FIXME: transmit with base64 format, maybe faster to transmit but adding encoding/decoding cost on server and database
    const timestamp = Date.now();
    console.log(timestamp);
    imageModel
        .uploadImage(timestamp, req.file.buffer.toString("base64"))
        .then(() => {
            // boardcast via socket
            wws.boardcast(`${timestamp}`);
            res.send();
        });
};

module.exports = {
    getImages,
    addImage,
};
