import jwt from "jsonwebtoken";

 const generatejwtToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "3d"
    })  // openssl rand -base64 32


    res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
        sameSite: "none",
        secure: true
    })
}

export default generatejwtToken