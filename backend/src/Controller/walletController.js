import Wallet from "../Model/Wallet.js";

export const getUserWallet =async (req,res)=> {
try {
    const userId = req.user._id;
    const wallet = await Wallet.find({userId});
    return res.status(201).json(wallet);
} catch (error) {
    console.error("Loi khi getWallet!");
    return res.status(501).json({message:"Loi he thong!"});
}
}
export const createNewWallet = async (req,res)=> {
    try {
        const userId = req.user?._id;
        const {walletName, remainAmount} = req.body;
        const wallet = new Wallet({
            userId,
            walletName,
            remainAmount
        });
        const newWallet = await wallet.save();
        res.status(200).json(newWallet);
    } catch (error) {
        console.error("Loi khi newWallet!");
        return res.status(501).json({message: "Loi he thong"});
    }
}