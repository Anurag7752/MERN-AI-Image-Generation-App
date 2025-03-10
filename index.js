import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import postRoutes from "./routes/postRoutes.js"
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();


app.use(cors());
app.use(express.json({limit: "50mb"}));

//Database
connectDB();

//Routes
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle",dalleRoutes);


app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from DALL-E!" });
});

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`);
})
