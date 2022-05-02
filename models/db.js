var { Client } = require("pg");

const clientConfig = {
    connectionString: process.env.DATABASE_URL,
};
if (!process.env.DATABASE_SSL_DEV) {
    clientConfig.ssl = {
        rejectUnauthorized: false,
    };
}
console.log("database: " + process.env.DATABASE_URL);
console.log("database ssl: " + clientConfig.ssl);

const db = {
    query: function (q) {
        const client = new Client(clientConfig);
        console.log("query: " + q.slice(0, 200));
        return client
            .connect()
            .then(() => client.query(q))
            .catch((err) => console.error("DB error:", err))
            .finally(() => client.end());
    },
    get: function (q) {
        return this.query(q).then((res) => {
            return res.rows;
        });
    },
    upload: function (q) {
        return this.query(q);
    },
};

module.exports = db;
