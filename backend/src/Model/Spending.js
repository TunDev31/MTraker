import mongoose from "mongoose";

export const SpendingSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true
        },
        description: {
            type: String,
            trim: true,
            default:""
        },
        
        amount : {
            type : Number,
            required : true,
        },
        type : {
            type : String,
            required : true,
            enum : ["income", "expense"]
        },
        tag : {
                type: [String],
                required: true,
    
        },
       
        completedAt: {
            type:Date,
            default: null,
        },
       
        walletType: {
            type: String,
            enum: ["momo", "sacombank", "cash","bidv"],
            required: true,
        }
    },
    {
        timestamps : true
    }
)
const Spending = mongoose.model("Spending", SpendingSchema);
export default Spending;