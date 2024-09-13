import express from "express"
import { loginController, registerController } from "../Controller/UserController.js"
const router = express.Router()

router.get("/cookie", (req, res) => {
    try {
        console.log(req.cookies)
        res.json(req.cookies)
        
    } catch (error) {
        
    }
})


router.post("/register", registerController)
router.post("/login", loginController)




export default router