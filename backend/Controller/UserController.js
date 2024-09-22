import bcrypt from 'bcrypt';
import User from '../Models/UserModels.js';
import generatejwtToken from '../utilities/generateJwtToken.js';
import Post from '../Models/PostModel.js';
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import checkOwnerShip from '../utilities/checkOwnerShip.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// 
const registerController = async (req, res) => {
    const { email, username, password, gender, confirmPassword } = req.body;
    console.log(email, username, password, confirmPassword, gender);

    try {

        // if i get blank fields
        if (!email || !username || !password || !gender) {
            return res.status(400).json({
                success: false,
                error: "email, username, or password missing",
                message: "Please fill all the fields."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: "Password didn't match.",
                message: "Password didn't match."
            })
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
            gender,
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

const getUser = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(401).json({ success: false, error: "user Id not found" })
        }
        const user = await User.findById(userId)
            .select("-password -posts")
        // console.log(user)

        if (!user) {
            return res.status(401).json({ success: false, error: "user not found" })
        }

        const totalPosts = await Post.countDocuments({
            userId: userId
        });
        const totalPublish = await Post.countDocuments({
            userId: userId,
            isPublished: true
        });

        // update image url
        const baseUrl = req.protocol + '://' + req.get('host');
        const updatedImage = user.image && `${baseUrl}/uploads/${path.basename(user.image)}`;

        user.image = updatedImage // Append the full path to the image
        res.status(200).json({ success: true, user, totalPosts, totalPublish })
    } catch (error) {

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

const updateNewName = async (req, res) => {

    try {
        const userId = req.userId
        const name = req.body.name;
        const updatedUser = await User.findByIdAndUpdate(userId, { name })
        if (!name) {
            return res.status(404).json({ success: false, error: "can't update new data" })
        }
        res.status(200).json({ success: true, name })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error: "server error" })

    }
}


const updateNewUserImage = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);

        // Get the new image path (if provided)
        const newImage = req.file ? `/uploads/${req.file.filename}` : null;

        // Find the user by ID to retrieve the current image
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found." });
        }

        const oldImage = user.image; // Store the old image path

        // Update the user's image with the new image
        const updatedUser = await User.findByIdAndUpdate(userId, {
            image: newImage
        }, {
            new: true
        });

        if (!newImage) {
            return res.status(404).json({ success: false, error: "No new image uploaded." });
        } else {
            // Update image URL
            const baseUrl = req.protocol + '://' + req.get('host');
            const updatedImage = updatedUser.image && `${baseUrl}/uploads/${path.basename(updatedUser.image)}`;

            updatedUser.image = updatedImage; // Append the full path to the image

            // Asynchronously delete the old image from the server if it exists
            if (oldImage) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(oldImage)); // Adjust based on your uploads folder location
                fs.promises.unlink(oldImagePath)
                    .then(() => console.log('Old image deleted successfully.'))
                    .catch(err => console.error('Error deleting old image:', err));
            }

            return res.status(200).json({ success: true, message: "New image updated.", user: updatedImage });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getUsrSixPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await Post.find({ userId })
            .select("title image isPublished createdAt")
            .sort({ createdAt: -1 })
            .limit(6)
        if (!posts) {
            return res.status(404).json({ success: false, })
        }

                // Format image URLs
                const updatedPosts = posts.map((post) => {
                    const baseUrl = req.protocol + '://' + req.get('host');
                    const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;
                    return {
                        ...post.toObject(), // Convert Mongoose document to a plain JS object
                        image: updatedImage // Append the full path to the image
                    };
                });

        return res.status(200).json({ success: true, posts: updatedPosts })

    } catch (error) {
        return res.status(500).json({ success: false, error, message: "server error" })

    }
}








const createNewPost = async (req, res) => {

    try {

        const { title, summary, content, keywords, category, readingTime, isPublished, imageTitle } = req.body;
        const username = req.username;
        const userId = req.userId;
        console.log(username, userId)
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const post = new Post({

            title,
            summary,
            content,
            keywords: keywords ? JSON.parse(keywords) : [],
            category,
            readingTime,
            imageTitle,
            image,
            isPublished,
            userId,
            username
        });

        const user = await User.findById(userId)
        if (post) {
            user.posts.push(post._id)

            await Promise.all([post.save(), user.save()])

            res.status(201).json({ success: true, message: "post created successfully.", id: post._id })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server Error." })

    }
}


const getAllPosts = async (req, res) => {
    try {
        const __dirname = path.resolve();

        // Get page and limit from query params, default to page 1 and 10 posts per page
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // console.log(page,limit)

        // Calculate how many posts to skip based on the current page
        const skip = (page - 1) * limit;

        // Fetch posts with pagination
        const posts = await Post.find({ isPublished: true })
            .select("title username summary image createdAt") // Selecting only necessary fields
            .sort({ createdAt: -1 }) // Sort by most recent
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ isPublished: true }); // Get the total count of posts
        const totalPages = Math.ceil(totalPosts / limit); // Calculate the total number of pages

        // Format image URLs
        const updatedPosts = posts.map((post) => {
            const baseUrl = req.protocol + '://' + req.get('host');
            const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;
            return {
                ...post.toObject(), // Convert Mongoose document to a plain JS object
                image: updatedImage // Append the full path to the image
            };
        });

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: totalPages,
            totalPosts: totalPosts,
            posts: updatedPosts
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, error: error });
    }
};

const getSinglePost = async (req, res) => {
    try {
        // console.log(req.params)
        if (!req.params.id) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        const baseUrl = req.protocol + '://' + req.get('host');
        const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;
        post.image = updatedImage;

        // Ensure the userId is not null before checking ownership
        const isOwner = post.userId ? await checkOwnerShip(req, post.userId) : false;

        res.status(200).json({ success: true, owner: isOwner, post });

        // res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRandomFourWithin = async (req, res) => {
    try {
        // Get the current time and 48 hours back
        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        // Aggregation pipeline
        const randomPosts = await Post.aggregate([
            {
                // Filter posts created within the last 48 hours
                $match: {
                    createdAt: { $gte: fortyEightHoursAgo }
                }
            },
            {
                // Randomly sort the posts
                $sample: { size: 3 }
            },
            {
                // Only include the title, image, and summary fields
                $project: {
                    title: 1,
                    image: 1,
                    summary: 1
                }
            }
        ]);

        // If no posts are found, send an empty array
        if (!randomPosts || randomPosts.length === 0) {
            return res.status(200).json({ success: true, message: 'No posts found in the last 48 hours.', posts: [] });
        }
        const updatedPosts = randomPosts.map((post) => {
            const baseUrl = req.protocol + '://' + req.get('host');
            const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;
            return {
                ...post, // Convert Mongoose document to a plain JS object ( it already a plain object , so need to use .toObject()
                image: updatedImage // Append the full path to the image
            };
        });
        // Return the randomly selected posts with only the requested fields
        return res.status(200).json({ success: true, posts: updatedPosts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

const getCategoryPosts = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 posts per page

        // Convert page and limit to integers
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        // Find posts where category matches (case-insensitive) and select only title, username, createdAt, and summary
        const posts = await Post.find({
            category: { $regex: category, $options: 'i' },
            isPublished: true
            // category: { $exists: true, $ne: null }
        })
            .select('title username createdAt summary image')  // Only return specific fields
            .skip((pageNum - 1) * limitNum)              // Skip posts for previous pages
            .limit(limitNum);                            // Limit the number of posts returned

        const totalPosts = await Post.countDocuments({
            category: { $regex: category, $options: 'i' },
            category: { $exists: true, $ne: null }
        });

        const totalPages = Math.ceil(totalPosts / limitNum); // Calculate total pages

        const updatedPosts = posts.map((post) => {
            const baseUrl = req.protocol + '://' + req.get('host');
            const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;
            return {
                ...post.toObject(), // Convert Mongoose document to a plain JS object ( it already a plain object , so need to use .toObject()
                image: updatedImage // Append the full path to the image
            };
        });
        res.status(200).json({
            success: true,
            posts: updatedPosts,
            totalPages,  // Return the total number of pages
            currentPage: pageNum
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};




export { registerController, loginController, getUser, updateNewUserImage, logout, updateNewName, getUsrSixPosts, UserCheck, createNewPost, getAllPosts, getSinglePost, getRandomFourWithin, getCategoryPosts };







// const getRandomFourWithin = async (req, res) => {
//     try {
//         // Get the current time and 24 hours back
//         const now = new Date();
//         const twentyFourHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

//         // Aggregation pipeline
//         const randomPosts = await Post.aggregate([
//             {
//                 // Filter posts created within the last 24 hours
//                 $match: {
//                     createdAt: { $gte: twentyFourHoursAgo }
//                 }
//             },
//             {
//                 // Randomly sort the posts
//                 $sample: { size: 4 }
//             }
//         ]);

//         // If no posts are found, send an empty array
//         if (!randomPosts || randomPosts.length === 0) {
//             return res.status(200).json({ success: true, message: 'No posts found in the last 48 hours.', posts: [] });
//         }

//         // Return the randomly selected posts
//         return res.status(200).json({ success: true, posts: randomPosts });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server Error' });
//     }
// }
