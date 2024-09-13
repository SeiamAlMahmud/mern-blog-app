import bcrypt from 'bcrypt';
import User from '../Models/UserModels.js'; 

const registerController = async (req, res) => {
    const { email, username, password } = req.body;
    console.log(email, username, password);

    try {
        // ফিল্ডগুলো ফাঁকা থাকলে রিটার্ন
        if (!email || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                error: "email, username, or password missing", 
                message: "Please fill all the fields."
            });
        }

        // ব্যবহারকারী ইতিমধ্যেই রয়েছে কিনা তা চেক
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

        // পাসওয়ার্ড হ্যাশ করা
        const hashedPassword = await bcrypt.hash(password, 10);

        // নতুন ব্যবহারকারী তৈরি করা
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword 
        });

        if (newUser) {
            console.log(newUser);
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

export  {registerController};
