import jwt from 'jsonwebtoken';
import User from '../Models/UserModels.js';

const checkOwnership = async (req, userId) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return false;
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            console.error('Invalid or expired token');
            return false;
        }

        if (!decodedToken) {
            return false;
        }

        const user = await User.findById(decodedToken.userId).select("-password");
        if (!user) {
            return false;
        }

        return userId.equals(user._id);

    } catch (error) {
        console.error("Error in checkOwnership:", error);
        return false;
    }
};

export default checkOwnership;
