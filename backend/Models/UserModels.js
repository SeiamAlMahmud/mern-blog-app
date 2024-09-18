import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: { type: String, default: "user"},
    image: { type: String },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
})

const User = mongoose.model("user", userSchema)

export default  User