const authRoutes = require("./auth.routes");
const folderRoutes = require("./folder.routes");
const fileRoutes = require("./file.routes");

// index file for all routes
module.exports = (app) => {
        authRoutes(app),
        folderRoutes(app),
        fileRoutes(app)
}
