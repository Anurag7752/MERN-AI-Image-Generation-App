import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import post from "../models/post.js";

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL POSTS
router.route('/').get(async (req, res) => {
  try {
    const posts = await post.find({});
    res.status(200).json({ success: true, data: posts }); // Fixed "post" to "posts"
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE A POST
router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Upload photo to Cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);

    // Create a new post
    const newPost = await post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
