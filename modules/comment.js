const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
    value: {
        type: String,
        // required: true,
    },

    createdTime: Date,

    postId: {
        type: String,
    }, 
})

CommentSchema.virtual("commentId").get(function () {
    return this._id.toHexString();
});

CommentSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Comment", CommentSchema);