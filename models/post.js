import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    prompt:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
});

const post = mongoose.model("post", postSchema);

export default post;