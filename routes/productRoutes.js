import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProduct, productPhotoController, updateProductController } from "../controller/productController.js";
import formidable from 'express-formidable'

const router = express.Router();

// routes
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController);

// update product
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);

// get products
router.get('/get-product', getProductController);

// single product
router.get('/get-product/:slug', getSingleProduct);

// get photo
router.get('/product-photo/:pid', productPhotoController);

// delete products
router.delete('/product/:pid', deleteProductController);

export default router