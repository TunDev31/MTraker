import Wallet from "../Model/Wallet.js";

export const getUserWallet =async (req,res)=> {
try {
    const userId = req.user._id;
    const wallet = await Wallet.find({userId});
    return res.status(200).json(wallet);
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
export const updateWallet = async (req, res) => {
    try {
        const { walletId } = req.params;
        const userId = req.user._id;
       
        const { amount } = req.body;
        const wallet = await Wallet.findOne({ _id: walletId, userId });
    
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        wallet.remainAmount += amount;
        const updatedWallet = await wallet.save();
        res.status(200).json(updatedWallet);
    } catch (error) {
        console.error("Loi khi updateWallet!");
        return res.status(501).json({ message: "Loi he thong" });
    }
}
export const getAnalyzeReport = async (req, res)=> {
    try {
         const userId = req.user._id;
          
         const walletReport = await Wallet.aggregate([
         {$match: {userId}},
         {$group: {
            _id:null,
            total: {$sum: "$remainAmount"},
            count: {$sum: 1}

         }}
         ]);
         
       
        const report = walletReport[0] || {total: 0, count: 0};
        return res.status(200).json(report);
    } catch (error) {
        console.log("Lỗi khi get wallet report");
        res.status(501).json({message:"Loi he thong!"});
    }
}

export const deleteWallet = async (req, res) => {
    try {
        const { walletId } = req.params;
        const userId = req.user._id;
       
       
       
       
        const wallet  = await Wallet.findOneAndDelete({ _id: walletId, userId });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });
        return res.status(200).json(wallet);
    } catch (error) {
        console.log("Lỗi khi del wallet ");
        res.status(501).json({message:"Loi he thong!"});
    }
}