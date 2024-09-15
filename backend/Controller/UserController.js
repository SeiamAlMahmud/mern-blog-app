import bcrypt from 'bcrypt';
import User from '../Models/UserModels.js';
import generatejwtToken from '../utilities/generateJwtToken.js';
import Post from '../Models/PostModel.js';
import path from "path"
// 
const registerController = async (req, res) => {
    const { email, username, password } = req.body;
    console.log(email, username, password);

    try {
        // if i get blank fields
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                error: "email, username, or password missing",
                message: "Please fill all the fields."
            });
        }

        // if new user is already exists?
        const existingUser = await User.findOne({
            $or: [{ username }, { email }] // either email or username should be unique
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "user already exists",
                message: "User with this email or username already exists."
            });
        }

        // hashing password for security
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (newUser) {
            console.log(newUser);
            generatejwtToken(newUser._id, res)
            return res.status(201).json({
                success: true,
                docData: newUser._id,
                message: "User registered successfully."
            });
        } else {
            return res.status(400).json({
                success: false,
                error: "user creation failed",
                message: "Something went wrong while creating the user."
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "server error",
            message: "An error occurred during user registration."
        });
    }
};


const loginController = async (req, res) => {
    try {

        const { username, password } = req.body
        console.log(username, password)

        // check if the use is exists
        if (!username || !password) {
            return res.status(404).json({ success: false, error: "Please fill all the fields" })
        }
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ success: false, error: "User not Found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid Credentials." })
        }
        if (user && isMatch) {
            generatejwtToken(user._id, res)
            return res.status(200).json({ success: true, message: "User login successfully.", docData: user._id })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: "Server error" })
    }
}

const UserCheck = (req, res) => {
    try {
        // console.log(req.cookies['token'])
        if (req.cookies['token']) {
            res.status(200).json({ success: true, token: req.cookies.token })
        }

    } catch (error) {
        res.status(401).json({ success: false, error: "Unauthorised" })
        return
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie('token');

        return res.status(200).json({ success: true, message: "user logout successfully" })


    } catch (error) {
        res.status(401).json({ success: false, error: "Unauthorised" })
        return
    }
}

const createNewPost = async (req, res) => {

    try {

        const { title, summary, content } = req.body;
        const username = req.username;
        const userId = req.userId;
        console.log(username, userId)
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const post = new Post({
            title,
            summary,
            content,
            image,
            userId,
            username
        });
        if (post) {

            await post.save();
            res.status(201).json({ success: true, message: "post created successfully.", id: post._id })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server Error." })

    }
}
const getAllPosts = async (req, res) => {
    try {
        const __dirname = path.resolve()
        const posts = await Post.find().select("title username summary image").sort({ createdAt: -1 });
        const updatedPosts = posts.map((post) => {
            const updatedImage = post.image && __dirname + post.image;
            return {
                ...post.toObject(), // Convert Mongoose document to a plain JS object
                image: updatedImage // Append the full path to the image
              };
        })
        res.status(200).json({success: true, updatedPosts});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, error:error });
    }
}

export { registerController, loginController, logout, UserCheck, createNewPost, getAllPosts };
