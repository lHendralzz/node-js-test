var express = require("express");
var swaggerUi = require("swagger-ui-express");
var appointmentRoute = require("./routes/appointment");
var errorController = require("./controllers/error");
var db = require("./util/database");
var app = express();
var swaggerDocument = require("./etc/swagger/swagger.json");

// check connection to databasse
db.execute("SELECT 1")
    .then(function (result) {
        console.log("database connected");
    })
    .catch(function (err) {
        console.log("database error ".concat(err));
        process.exit(1);
    });

// log incoming request
app.use(function (req, res, next) {
    console.log("incoming request:", req.method, req.url);
    next();
});
// route appointment
app.use("/appointment", appointmentRoute);
// Set up Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// not found
app.use(errorController.errorNotFound);
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
