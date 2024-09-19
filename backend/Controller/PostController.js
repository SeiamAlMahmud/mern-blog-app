import Post from "../Models/PostModel.js";
import path from "path"
import fs from "fs"
import checkOwnership from "../utilities/checkOwnerShip.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const infinityPost = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 2;  // প্রতিবার ২টি পোস্ট ফেচ হবে
        const skip = parseInt(req.query.skip) || 0;    // আগের পোস্ট স্কিপ হবে
        const currentPostId = req.body.currentPostId;

        // বর্তমান পোস্ট বাদে বাকি পোস্টগুলো খুঁজে বের করা
        const posts = await Post.find({ _id: { $ne: currentPostId } })
            .skip(skip) // আগের পোস্টগুলো স্কিপ করা
            .limit(limit) // লিমিট অনুযায়ী পোস্ট লোড করা
            .sort({ createdAt: -1 }) // সর্বশেষ পোস্ট প্রথমে দেখানো
            .exec();

        const totalPosts = await Post.countDocuments(); // মোট পোস্ট সংখ্যা
        const hasMore = skip + posts.length < Math.min(5, totalPosts); // সর্বমোট ৫টি পোস্টের বেশি ফেচ হবে না

        // পোস্ট ইমেজের URL এবং isOwner চেক করা
        let updatedPosts = [];
        for (let post of posts) {
            const baseUrl = req.protocol + '://' + req.get('host');
            const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;

            // এখানে async/await ব্যবহার করা হচ্ছে
            const isOwner = post.userId ? await checkOwnership(req, post.userId) : false;

            // পোস্টকে আপডেট করা
            updatedPosts.push({
                ...post.toObject(), // Mongoose ডকুমেন্টকে JS object এ কনভার্ট করা
                image: updatedImage, // ইমেজ URL আপডেট করা
                owner: isOwner, // মালিকানা চেক করা
            });
        }

        // যদি কোনো পোস্ট না থাকে
        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, error: "No more posts available." });
        } else {
            // সফলভাবে ডাটা রিটার্ন করা
            return res.status(200).json({ success: true, infinityPost: updatedPosts, hasMore });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};






const editExistingPost = async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, keywords, category, readingTime, imageTitle } = req.body;

  try {
    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Update fields
    post.title = title;
    post.summary = summary;
    post.content = content;
    post.keywords = JSON.parse(keywords); // assuming keywords is JSON stringified in frontend
    post.category = category;
    post.readingTime = readingTime;
    post.imageTitle = imageTitle;

    // Handle image update
    if (req.file) { // if a new image is provided
      const newImagePath = `/uploads/${req.file.filename}`;  // assuming multer saves the file in /uploads
      const oldImagePath = post.image;

      // Delete old image from filesystem if it exists and is not the default image
      if (oldImagePath && oldImagePath !== '/uploads/default-image.jpg') {
        const oldImageFullPath = path.join(__dirname, '..', 'uploads', path.basename(oldImagePath));
        if (fs.existsSync(oldImageFullPath)) {
          fs.unlinkSync(oldImageFullPath);
        }
      }

      // Update post image with new image path
      post.image = newImagePath;
    }

    // Save updated post
    await post.save();

    res.json({ success: true, message: 'Post updated successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};





export { infinityPost, editExistingPost }