import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        // validate
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Requied' });
            case !description:
                return res.status(500).send({ error: 'Description is Requied' });
            case !price:
                return res.status(500).send({ error: 'Price is Requied' });
            case !category:
                return res.status(500).send({ error: 'Category is Requied' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is Requied' });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is Requied and should be less than 1mb' });
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Photo saved successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating product'
        })
    }
}

// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: 'AllProducts',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting products',
            error: error.message,
        })
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).populate('category').select('-photo');
        res.status(200).send({
            success: true,
            message: 'Single message fetched',
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error: error.message,
        })
    }
}

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo');
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product photo',
            error: error.message,
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        // validate
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Requied' });
            case !description:
                return res.status(500).send({ error: 'Description is Requied' });
            case !price:
                return res.status(500).send({ error: 'Price is Requied' });
            case !category:
                return res.status(500).send({ error: 'Category is Requied' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is Requied' });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is Requied and should be less than 1mb' });
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, 
            {...req.fields, slug: slugify(name)}, 
            {new: true}
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Photo updated successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to update product update',
            error: error.message,
        })
    }
}
