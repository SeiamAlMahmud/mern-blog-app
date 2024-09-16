import express from "express"
import { UserCheck, createNewPost, getAllPosts, getRandomFourWithin, getSinglePost, loginController, logout, registerController } from "../Controller/UserController.js"
import path from "path"
import multer from "multer";
import authMiddleware from "../middleWare/authMiddleware.js";
const router = express.Router()


const __dirname = path.resolve()
// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// Handle fetching cookie [token]
router.get("/cookie", UserCheck)
// Handle Logout
router.get("/logout", logout)

// Handle Registration
router.post("/register", registerController)
// Handle Login
router.post("/login", loginController)


// Handle image uploads
router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ url: `${__dirname}/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

router.post('/posts',authMiddleware,upload.single('image'),createNewPost)
router.get('/getAllPosts',getAllPosts)
router.get('/post/:id',getSinglePost);
router.get('/randomPost',getRandomFourWithin);


export default router