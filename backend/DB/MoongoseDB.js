import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then(res => {
                // console.log(res)
                console.log(("DB Connected"));
            })
    } catch (error) {
    }
}

export default connectDB