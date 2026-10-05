import User from "../Model/Users.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import Session from "../Model/Session.js";
const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14*24*60* 60*1000;
const isProd = process.env.NODE_ENV === "production";
export const signUp = async (req,res)=> {


    try {
        const {userName, password,email,firstName, lastName,} = req.body;
        if (!userName || !password || !email|| !firstName || !lastName) {
            return res.status(400).json({message:"Thong tin khong duoc de trong!"})
        }
        const isDuplicatedUser = await  User.findOne({userName});
        if (isDuplicatedUser) {
            return res.status(400).json({message:"Nguoi dung da ton tai!"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            userName,
            hashedPassword,
            email,
            displayedName: `${firstName} ${lastName}`
        })
        return res.sendStatus(200);
    } catch (error) {
        console.log("loi khi goi signUp");
     return   res.status(500).json({message:"Loi he thong!"});

    }
}
export const signIn = async (req,res) => {
    try {
        const {userName, password} = req.body;
        if (!userName || !password) {
            return res.status(400).json({message:"Thong tin dang nhap khong duoc de trong!"})
        }
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(400).json({message:"username hoac password khong chinh xac"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordCorrect) return res.status(400).json({message:"username hoac password khong chinh xac"});

        const accessToken = jwt.sign({userId: user._id},process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user._id,
            refreshToken,
            expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });
    res.cookie('refreshToken',refreshToken,{
        httpOnly: true,
        secure: isProd,
       sameSite: isProd ? 'none' : 'lax',
        maxAge: REFRESH_TOKEN_TTL
    });
    return res.status(200).json({message: `User ${user.displayedName} Log In thanh cong!`,accessToken});
    } catch (error) {
          console.error("loi khi goi signIn");
         return res.status(500).json({message:"Loi he thong!"})
    }
}
export const signOut = async(req,res)=> {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            await Session.deleteOne({refreshToken: token});
            res.clearCookie("refreshToken");
        }
        res.sendStatus(204);
    } catch (error) {
         console.error("loi khi goi signOut");
         return res.status(500).json({message:"Loi he thong!"})
    }
}

export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "Không có refresh token" });
  const session = await Session.findOne({ refreshToken: token, expiredAt: { $gt: new Date() } });
  if (!session) return res.status(401).json({ message: "Session hết hạn, vui lòng đăng nhập lại" });
  const newAccessToken = jwt.sign(
    { userId: session.userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  );
  const user = await User.findById(session.userId).select("-hashedPassword");
  return res.status(200).json({ accessToken: newAccessToken ,user});
};