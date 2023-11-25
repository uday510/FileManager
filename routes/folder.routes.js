const folderController = require("../controllers/folder.controller");
const authUser = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.post(
        "/app/api/v1/folders",
        [authUser.verifyToken],
        folderController.createFolder
    );
    app.post(
        "/app/api/v1/folders/:parentId/subfolders",
        [authUser.verifyToken],
        folderController.createSubFolder
    );
};
