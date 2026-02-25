import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//register new user end point /auth/register
router.post('/register', (req,res) => {
    const {username, password} = req.body
    //save the username and an irreversibly encrypted password
    //save yourmail@gmail.com | ahdjasjhsdsdsdshds.skdsdjsh.adjsndjsdhdhsd

    //encrypt 
    const hashedPassword = bcrypt.hashSync(password, 8)
    // Save the new user and save the password to the DB and Encrypt
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (? , ?)`)
        const result = insertUser.run(username,hashedPassword)

        // now we that have a user i want to use their firstt todo for them
        const defaultTodo = `Hello :) add Your first todo`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES(?,?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)
        
        //create a token
        const token =  jwt.sign({id: result.lastInsertRowid}, process.env.
            JWT_SECRET,{expiresIn: '24h'})
            res.json({token})

    } catch (err) {
        console.log(err.message);
        res.sendStatus(503)
    }
})

router.post('/login', (req,res) => {
    //get mail and check the password assosciated with the that email in the DB
    //but in the backend  and we see it encrypted
    //encyrpt the password and compare with it one 
    
    const {username, password} = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)
        //if we cannot find a user with the user name . it return the message and exit
        if(!user){
            return res.status(404).send({message: "User not found"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if(!passwordIsValid) {
            return res.sendStatus(401).send({message: "Invalid password"})
        }
        //then we have some successs full authentication
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
})

export default router