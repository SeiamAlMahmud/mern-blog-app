import jwt from 'jsonwebtoken'
import User from '../Models/UserModels.js';

const authMiddleware = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, error: "Unauthorized - No token provided." })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decode) {
            return res.status(401).json({ success: false, error: "Unauthorized - No token provided." })
        }
        const user = await User.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // console.log("user",user)
        // console.log("token", token)
        // console.log("decode", decode)
        req.userId = user._id || decode.userId;
        req.username = user.username;
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute", error)
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    
    }
}

export default authMiddleware