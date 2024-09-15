import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    summary: { type: String, required: true, maxlength: 160 },
    content: { type: String, required: true },
    image: { type: String }
  },{timestamps: true});
  
  const Post = mongoose.model('Post', PostSchema);
  export default Post