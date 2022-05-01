var db = require("./db");

ImageModel = {
    // getLatestTimeStamp: function () {
    //     return db.get(
    //         "SELECT timestamp FROM image ORDER BY timestamp DESC LIMIT 1"
    //     );
    // },
    // getTimestamps: function () {
    //     return db.get("SELECT timestamp FROM image");
    // },
    getImages: function (from = null, to = null, at = null, limit = null) {
        // NOTE: in descending order, so from >= to
        var q = "SELECT timestamp, encode(lo_get(raster), 'base64') FROM image";
        if (from || to || at) {
            q += " WHERE ";
            if (from) {
                q += "timestamp <= '" + from + "'";
                if (to) q += " AND timestamp >= '" + to + "'";
            } else if (to) q += "timestamp >= '" + to + "'";
            else q += "timestamp = '" + at + "'";
        }
        q += " ORDER BY timestamp DESC";
        if (limit) q += " LIMIT " + limit;

        return db.get(q);
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
