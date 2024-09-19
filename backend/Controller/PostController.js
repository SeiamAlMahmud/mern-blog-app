import Post from "../Models/PostModel.js";
import path from "path"
const infinityPost = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = parseInt(req.query.skip) || 0;
        const currentPostId = req.body.currentPostId

        const posts = await Post.find({ _id: { $ne: currentPostId } })
            .skip(skip) // আগের পোস্টগুলো স্কিপ করা
            .limit(limit) // লিমিট অনুযায়ী পোস্ট লোড করা
            .sort({ createdAt: -1 })
            .exec();

        const totalPosts = await Post.countDocuments(); // মোট পোস্ট সংখ্যা
        const hasMore = skip + posts.length < totalPosts;

        let updatedPosts
        if (posts) {
            updatedPosts = posts.map((post) => {
                const baseUrl = req.protocol + '://' + req.get('host');
                const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;
                return {
                    ...post.toObject(), // Convert Mongoose document to a plain JS object
                    image: updatedImage // Append the full path to the image
                };
            });
        }
        if (!posts) {
            return res.status(404).json({ success: false, error: "there are no post in database.." })
        } else {
            res.status(200).json({ success: true, infinityPost: updatedPosts, hasMore });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, error: error, message: "Server Error" });
    }
}
export { infinityPost }