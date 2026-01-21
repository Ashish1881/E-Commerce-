import express from "express";
import AddToCart from "../../Controllers/User/CartControllers.js";

const cardRouter = express.Router();

cardRouter.post("/items/:userId", AddToCart);

export default cardRouter;
