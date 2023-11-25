const bcrypt = require('bcrypt');
const db = require('../config/db.config'); 

const saltRounds = 10; // Cost factor for hashing

class UserModel {
    async createUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
        return newUser.rows[0];
    }

    async getUserByEmail(email) {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return user.rows[0];
    }

    async getUserById(id) {
        const user = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);
        return user.rows[0];
    }


    async comparePassword(inputPassword, hashedPassword) {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }

}

module.exports = UserModel;
