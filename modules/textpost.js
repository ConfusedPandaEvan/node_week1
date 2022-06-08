const mongoose = require("mongoose");

const TextPostSchema = new mongoose.Schema({
    value: {
        type: String,
        // required: true,
    },

    createdTime: Date,


    writer: {
        type: String,
    }, 

    title: {
        type: String,
        // required: true,
    }
})

TextPostSchema.virtual("postId").get(function () {
    return this._id.toHexString();
});

TextPostSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("TextPost", TextPostSchema);