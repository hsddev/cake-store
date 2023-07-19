// Dependencies
const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose
        .connect(process.env.MONGOLAB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        .then((conn) =>
            console.log(`Database Connected: ${conn.connection.host}`)
        );
};

// Export module
module.exports = dbConnection;
