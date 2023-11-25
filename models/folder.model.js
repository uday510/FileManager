const db = require('../config/db.config');

class FolderModel {
    async createFolder(name, parentId, userId) {
        const newFolder = await db.query('INSERT INTO folders (name, parent_id, user_id) VALUES ($1, $2, $3) RETURNING *', [name, parentId, userId]);
        return newFolder.rows[0];
    }

    async createSubfolder(name, parentId, userId) {
        const parentFolder = await db.query('SELECT * FROM folders WHERE id = $1 AND userId = $2', [parentId, userId]);

        if (parentFolder.rows.length === 0) {
            throw new Error('Permission denied or parent folder not found');
        }

        this.createFolder(name, parentId, userId);
    }

    async getFoldersByUserId(userId) {
        const folders = await db.query('SELECT * FROM folders WHERE user_id = $1', [userId]);
        return folders.rows;
    }
    async getFoldersById(id) {
        const folders = await db.query('SELECT * FROM folders WHERE id = $1', [id]);
        return folders.rows[0];
    }
}

module.exports = FolderModel;
