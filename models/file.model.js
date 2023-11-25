const db = require('../config/db.config'); // Your PostgreSQL database connection

class File {
    async createFile(fileName, fileSize, folderId, userId) {
        try {
            const query = `
        INSERT INTO files (file_name, file_size, folder_id, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
            const values = [fileName, fileSize, folderId, userId];
            const newFile = await db.query(query, values);
            return newFile.rows[0];
        } catch (error) {
            console.log(error.message);
            throw new Error('Failed to create file');
        }
    }

    async getFileById(fileId) {
        try {
            const query = 'SELECT * FROM files WHERE id = $1;';
            const values = [fileId];
            const file = await db.query(query, values);
            return file.rows[0];
        } catch (error) {
            throw new Error('Failed to fetch file');
        }
    }

    async updateFileName(fileId, newFileName) {
        try {
            const query = 'UPDATE files SET file_name = $1 WHERE id = $2 RETURNING *;';
            const values = [newFileName, fileId];
            const updatedFile = await db.query(query, values);
            return updatedFile.rows[0];
        } catch (error) {
            throw new Error('Failed to update file name');
        }
    }

    async moveFile(fileId, newFolderId) {
        try {
            const query = 'UPDATE files SET folder_id = $1 WHERE id = $2 RETURNING *;';
            const values = [newFolderId, fileId];
            const movedFile = await db.query(query, values);
            return movedFile.rows[0];
        } catch (error) {
            throw new Error('Failed to move file');
        }
    }

    async deleteFile(fileId) {
        try {
            const query = 'DELETE FROM files WHERE id = $1 RETURNING *;';
            const values = [fileId];
            const deletedFile = await db.query(query, values);
            return deletedFile.rows[0];
        } catch (error) {
            throw new Error('Failed to delete file');
        }
    }
}

module.exports = File;
