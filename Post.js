const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    category:String,
    title:String,
    description:String,
    image:String,
    targetFunds:Number,
    raisedFunds:{type: Number, default: 0},
    createdAt:{type:Date, default: Date.now},
    deadline: String,
    likes: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
})
module.exports = mongoose.model("Post", PostSchema);  //exporting the model