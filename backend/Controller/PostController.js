import Post from "../Models/PostModel.js";
import path from "path"
import checkOwnership from "../utilities/checkOwnerShip.js";
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


export { infinityPost }