import Post from "../Models/PostModel.js";

const infinityPost = async (req,res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = parseInt(req.query.skip) || 0;

    try {
        const posts = await Post.find()
            .skip(skip) // আগের পোস্টগুলো স্কিপ করা
            .limit(limit) // লিমিট অনুযায়ী পোস্ট লোড করা
            .sort({ createdAt: -1 })
            .exec();

        const totalPosts = await Post.countDocuments(); // মোট পোস্ট সংখ্যা
        const hasMore = skip + posts.length < totalPosts;
        if (!posts) {
            return res.status(404).json({ success: false, error: "there are no post in database.." })
        }else{
            res.status(200).json({success: true, infinityPost:posts, hasMore });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({success: false, error: error,  message: "Server Error" });
    }
}
export { infinityPost }