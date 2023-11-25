const { user } = require('pg/lib/defaults');
const FolderModel = require('../models/folder.model');
const folderModel = new FolderModel();

exports.createFolder = async (req, res) => {
    console.clear();
    try {
        const name = req.body.name;
        console.log(req.body);
        if (!name) {
            return res.status(400).send(`Required Fields are missing`);
        }

        const userFolders = await folderModel.getFoldersByUserId(req.user.id);


        userFolders.forEach(folder => {
            if (folder.name === name) {
                return res.status(400).send("Folder already exists");
            }
        });

        const newFolder = await folderModel.createFolder(name, null, req.user.id);
        return res.status(201).json(newFolder);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Folder creation failed' });
    }
};
exports.createSubFolder = async (req, res) => {
    try {
        const parentId = req.params.parentId;
        const folderName = req.body.name;

        if (!parentId || !folderName) {
            return res.status(400).send(`Required Fields are missing`);
        }
        const folder = await folderModel.getFoldersById(parentId);

        if (!folder) {
            return res.status(400).send(`parent folder does not exists.`);
        }

        const newSubFolder = await folderModel.createFolder(folderName, parentId, req.user.id);
        return res.status(201).json(newSubFolder);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Folder creation failed' });
    }
}

exports.getFoldersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const userFolders = await folderModel.getFoldersByUserId(userId);
        return res.status(200).json(userFolders);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch folders' });
    }
};


