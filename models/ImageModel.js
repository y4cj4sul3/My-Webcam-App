var db = require("./db");

// cold start
// create table if not exist
db.query("CREATE TABLE IF NOT EXISTS image(timestamp char(13), raster oid)");

// manipulate images
const getImages = (from = null, to = null, at = null, limit = null) => {
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
};
const uploadImage = (timestamp, data) => {
    return db.upload(
        // `INSERT INTO image(timestamp, raster) VALUES ('${timestamp}', lo_import('${filepath}'))`
        // `INSERT INTO image(timestamp, raster) VALUES ('${timestamp}', lo_from_bytea(0, '\\x${data}'))`
        `INSERT INTO image(timestamp, raster) VALUES ('${timestamp}', lo_from_bytea(0, decode('${data}', 'base64')))`
    );
};
const deleteImage = (timestamp) => {
    return db
        .get(`SELECT raster FROM image WHERE timestamp='${timestamp}'`)
        .then((res) => {
            // get image oid
            if (res.length == 0) {
                console.log(`image at ${timestamp} not exist`);
                return false;
            }
            var img_oid = res[0]["raster"];
            console.log("image oid: " + img_oid);

            // remove image and the row from table
            return db
                .query(
                    `DELETE FROM image WHERE timestamp='${timestamp}'; SELECT lo_unlink('${img_oid}')`
                )
                .then(() => {
                    console.log(`image at ${timestamp} is deleted`);
                    return true;
                });
        });
};

// manipulate timestamp
const getLatestTimeStamp = () => {
    return db.get(
        "SELECT timestamp FROM image ORDER BY timestamp DESC LIMIT 1"
    );
};
const getTimestamps = () => {
    // for debuging
    return db.get("SELECT timestamp FROM image");
};

module.exports = {
    getImages,
    uploadImage,
    deleteImage,
    getLatestTimeStamp,
    getTimestamps,
};
