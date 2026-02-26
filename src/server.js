import express from 'express' // const express = reqire(express)
import path,{dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js'


const app = express();
const PORT = process.env.PORT || 5000

//get file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
//get the dir name for the file path
const __dirname = dirname(__filename)

//middleware
app.use(express.json())
//servers the html file from the public dir 
// tell the server to consider all the file from public as static files
app.use(express.static(path.join(__dirname,'../public')))


//Serving up the html file from the public dir 
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

//routes
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)


app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})

