import express from "express";
import { getProducts, createProduct, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts); // Get all products

router.get("/:id", getProduct); // Get specific product

router.post("/", createProduct); // Create product

router.put("/:id", updateProduct); // Update product

router.delete("/:id", deleteProduct); // Delete product 

// 22:36
export default router;