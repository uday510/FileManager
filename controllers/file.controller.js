const File = require('../models/file.model');
const Folder = require('../models/folder.model');
const AWS = require('aws-sdk');

const fileModel = new File();
const folderModel = new Folder();
const s3 = new AWS.S3({
    // AWS configuration
});

exports.uploadFile = async (req, res) => {
    // console.clear();
    try {
        const folderId = req.body.folderId;
        if (!folderId) {
            return res.status(400).send("folderId is missing.")
        }
        const fileName = req.file.originalname;
        const fileSize = req.file.size;

        if (fileSize > 2 * 1024 * 1024) { // 2 MB
            return res.status(400).send("Maximum file 2 MB allowed.")
        }

        const folder = await folderModel.getFoldersById(folderId);

        if (!folder || folder.user_id != req.userId) {
            return res.status(400).send("Not a valid folder id.")
        }

        // Upload file to AWS S3
        const uploadParams = {
            Bucket: 'bucket-name',
            Key: fileName,
            Body: req.file.buffer, 
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        console.log("S3 >> ", uploadResult);
        
        // Record file metadata in the database
        const uploadedFile = await fileModel.createFile(fileName, fileSize, folderId, req.userId);
        res.status(201).send(uploadedFile);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

exports.renameFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { newName } = req.body;
        const updatedFile = await fileModel.updateFileName(fileId, newName);
        res.status(200).json(updatedFile);
    } catch (error) {
        res.status(500).json({ error: 'File rename failed' });
    }
};

exports.moveFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { newFolderId } = req.body;

        const folder = await folderModel.getFoldersById(newFolderId);
        if (!folder || folder.user_id != req.userId) {
            return res.status(200).send("Not a valid folder id")
        }
        const movedFile = await fileModel.moveFile(fileId, newFolderId);
        res.status(200).json(movedFile);
    } catch (error) {
        res.status(500).json({ error: 'File move failed' });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const deleteParams = {
            Bucket: 'bucket-name',
            Key: fileId, 
        };
        await s3.deleteObject(deleteParams).promise();

        const deletedFile = await fileModel.deleteFile(fileId);
        res.status(200).json(deletedFile);
    } catch (error) {
        res.status(500).json({ error: 'File deletion failed' });
    }
};

