var db = require("./db");

ImageModel = {
    timestamp: "",
    img: "",

    getTimestamps: function () {
        return db.get("SELECT timestamp FROM image");
    },
    getAllImages: function () {
        return db.get("SELECT encode(lo_get(raster), 'base64') FROM image");
    },
    getImage: function (timestamp) {
        return db.get(
            `SELECT encode(lo_get(raster), 'base64') FROM image WHERE timestamp='${timestamp}'`
        );
    },
    uploadImage: function (timestamp, data) {
        return db.upload(
            // `INSERT INTO image(timestamp, raster) VALUES ('${timestamp}', lo_import('${filepath}'))`
            // `INSERT INTO image(timestamp, raster) VALUES ('${timestamp}', lo_from_bytea(0, '\\x${data}'))`
            `INSERT INTO image(timestamp, raster) VALUES ('${timestamp}', lo_from_bytea(0, decode('${data}', 'base64')))`
        );
    },
};

module.exports = ImageModel;
