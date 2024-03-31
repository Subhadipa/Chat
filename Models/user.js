const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname:{
        type:String
    },
    lname:{
        type:String  
    },
    phone:{
        type:Number
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},
    { timestamps: true });

module.exports = mongoose.model("user", userSchema);