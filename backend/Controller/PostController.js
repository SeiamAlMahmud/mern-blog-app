import Post from "../Models/PostModel.js";
import path from "path"
const infinityPost = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 2;  // লিমিট ২টা করে ফেচ
      const skip = parseInt(req.query.skip) || 0;    // স্কিপ 
      const currentPostId = req.body.currentPostId;
  
      // বর্তমান পোস্ট বাদে বাকি পোস্টগুলো খুঁজে বের করা
      const posts = await Post.find({ _id: { $ne: currentPostId } })
        .skip(skip) // আগের পোস্টগুলো স্কিপ করা
        .limit(limit) // প্রতিবার লিমিট অনুযায়ী পোস্ট লোড করা
        .sort({ createdAt: -1 }) // সর্বশেষ পোস্ট প্রথমে দেখানো
        .exec();
  
      const totalPosts = await Post.countDocuments(); // মোট পোস্ট সংখ্যা
      const hasMore = skip + posts.length < Math.min(5, totalPosts); // সর্বমোট ৫ টা পোস্ট লোড হওয়ার পরে বন্ধ
  
      // পোস্ট ইমেজের URL আপডেট করা
      let updatedPosts;
      if (posts) {
        updatedPosts = posts.map((post) => {
          const baseUrl = req.protocol + '://' + req.get('host');
          const updatedImage = post.image && `${baseUrl}/uploads/${path.basename(post.image)}`;
          
          return {
            ...post.toObject(), // Mongoose ডকুমেন্টকে JS object এ কনভার্ট করা
            image: updatedImage, // ইমেজ URL আপডেট করা
          };
        });
      }
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ success: false, error: "No more posts available." });
      } else {
        res.status(200).json({ success: true, infinityPost: updatedPosts, hasMore });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };
  
export { infinityPost }