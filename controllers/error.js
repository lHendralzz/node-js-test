const path = require("path");
const rootDir = require("../util/path");

exports.errorNotFound = (req, res, next) => {
    console.log("404 not-found route");
    res.status(404).sendFile(path.join(rootDir, "views", "not-found.html"));
};
