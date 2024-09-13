import express from "express"
import { UserCheck, loginController, logout, registerController } from "../Controller/UserController.js"
const router = express.Router()

router.get("/cookie",UserCheck)
router.get("/logout",logout)


router.post("/register", registerController)
router.post("/login", loginController)




export default router