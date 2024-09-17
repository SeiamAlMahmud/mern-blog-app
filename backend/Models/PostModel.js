import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  username: { type: String, required: true },
  summary: { type: String, required: true, },
  content: { type: String, required: true },
  image: { type: String },
  imageTitle: { type: String },
  keywords: [{ type: String }],
  category: { type: String, required: true },
  readingTime: { type: Number, required: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
export default Post;
