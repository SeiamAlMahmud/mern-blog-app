import express from "express"
import "dotenv/config"
import connectDB from "./DB/MoongoseDB.js"
const app = express()

const port = process.env.PORT || 3000

app.listen(port, ()=> {
    connectDB()
    console.log(`Server start on ${port}`)
})