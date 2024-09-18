import express from "express"
import "dotenv/config"
import connectDB from "./DB/MoongoseDB.js"
import cors from "cors"
import cookieParser from 'cookie-parser';
import UserRouter from "./Route/UserRoute.js"
import path from 'path'
const app = express()




const port = process.env.PORT || 3000
const __dirname = path.resolve()

app.use(cors({
    origin: ['http://localhost:5173','https://news.almahmud.top'] ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // 'multipart/form-data' and 'image/*'
    credentials: true, 
}));

app.use(cookieParser())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// EndPoints
app.use("/api", UserRouter)
app.get("/", (req, res)=> {
    res.json("ok")
})
app.listen(port, ()=> {
    connectDB()
    console.log(`Server start on ${port}`)
})