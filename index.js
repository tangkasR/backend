import express from 'express'
import db from './config/Database.js'
import router from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();

try{
    await db.authenticate();
    console.log("Database Connected...")
}catch(error) {
    console.log(error)
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(5000, () => console.log(`Server is running in port 5000...`))