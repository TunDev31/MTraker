import jwt from 'jsonwebtoken'
import User from '../Model/Users.js';


export const protectedRoute = (req, res, next)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: "Khong co accessToken"});

        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decodedUser)=> {
            if (error) {
                console.error(error);
                return res.status(401).json({message:"Invalid token"})
            }
             const user  = await User.findById(decodedUser.userId).select('-hashedPassword');
             if (!user) {
                return res.status(404).json({message:"User khong ton tai!"});
             }
            req.user = user; 
            next();
        });
       
    } catch (error) {
        console.error("Loi khi goi middleware", error);
        return res.status(500).json({message:"Loi he thong"})
    }
}