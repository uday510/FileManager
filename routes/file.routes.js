const fileController = require('../controllers/file.controller');
const authUser = require("../middlewares/auth.middleware");
const multer = require('multer');

const upload = multer(); // Initialize multer instance


module.exports = (app) => {

    app.post(
        "/app/api/v1/file",
        upload.single('file'),
        [authUser.verifyToken],
        fileController.uploadFile
    );
    
    app.patch(
        "/app/api/v1/file",
        [authUser.verifyToken],
        fileController.renameFile
    );
    app.delete(
        "/app/api/v1/file",
        [authUser.verifyToken],
        fileController.deleteFile
    );
}