//Server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors';
import { connectDB } from "./develop/config/db.js";
import cookieParser from 'cookie-parser';

import productRoutes from "./develop/routes/product.route.js";
import jyotirlingRoutes from "./develop/routes/jyotirling.route.js";
import devoteeRoutes from "./develop/routes/devotee.route.js";
import userRoutes from "./develop/routes/user.route.js";

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use(cors());
app.use(cookieParser());


app.use("/api/products", productRoutes);
app.use("/api/jyotirlings", jyotirlingRoutes);
app.use("/api/devotee", devoteeRoutes);
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
else{
	app.use(cors({
	  origin: process.env.DEV_FRONTEND_URL,
	  credentials: true,
	}));
}

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
