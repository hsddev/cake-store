// Dependencies
const functions = require("firebase-functions");

const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const globalError = require("./middlewares/errorMiddleware");
const routes = require("./routes");
const ApiError = require("./utils/apiError");
const dbConnection = require("./config/database");

// Express app
const app = express();

// Middlewares
dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use(express.static(path.join(__dirname, "uploads")));

const API_PREFIX = "api";
// Rewrite Firebase hosting requests: /api/:path => /:path
app.use((req, res, next) => {
    if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
        req.url = req.url.substring(API_PREFIX.length + 1);
    }
    next();
});

// Route
app.use(routes);

// Handle unhanding routes and send the error to the error middleware
app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

// Mongodb connection
dbConnection();

// Port
const { APP_PORT } = process.env;

// Start the server
const server = app.listen(APP_PORT, () => {
    console.log(`Start listening on port ${APP_PORT}`);
});

exports[API_PREFIX] = functions.https.onRequest(app);

// Handle rejection outside the express
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log("Shutting down...");
        process.exit(1);
    });
});
