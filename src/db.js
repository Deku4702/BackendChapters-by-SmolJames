import {DatabaseSync} from 'node:sqlite'
const db = new DatabaseSync(':memory:')

//exceute SQL statement from strings

db.exec(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
    `)

    //In Big organization use soft delete, mean a boolean value will be set to 1. actual data is saved in the dataBase
db.exec(`
        CREATE TABLE todos(
        
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           user_id INTEGER,
           task TEXT,
           completed BOOLEAN DEFAULT 0,
           FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `)

export default db