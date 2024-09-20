import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isBlock: { type: Boolean, default: false },
  image: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female"], // Gender can only be "Male" or "Female"
    required: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: []
  }]
})

const User = mongoose.model("user", userSchema)

export default User