import { sql } from "../config/db.js";

// CRUD operations 

export const getProducts = async(req, res) => {
    try {
        const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;

        console.log("Feteched Products: ", products);
        res.status(200).json({success:true, data: products});
    } catch (error) {
        console.log("Error in getting all products: ", error);
        res.status(500).json({success: false, message:"Internal Server Error"})
    }
};

export const createProduct = async(req, res) => {

    const {name, price, image} = req.body

    if(!name || !price || !image){
         return res.status(400).json({success:false, message:"All fields are required"});
     }

     try {
        
        const newProduct = await sql`
        INSERT INTO products(name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *
        `
        console.log("New product added", newProduct);
        res.status(201).json({success:true, data:newProduct[0]});

     } catch (error) {
        console.log("Error creating product: ", error);
        res.status(500).json({success: false, message:"Error creating product"});

     }

};

export const getProduct = async(req, res) =>{
    const { id } = req.params

    try {
        const product = await sql `
        SELECT * FROM products WHERE id=${id}
        `
        res.status(201).json({success:true, data:product[0]});

    } catch (error) {
        console.log("error in getProduct function", error);
        res.status(500).json({success: false, message:"Error getting the product"});
    }
};

export const updateProduct = async(req, res) => {

    const { id } = req.params;
    const { name, price, image } = req.body;

    try {

        const updateProduct = await sql`
        UPDATE products
        SET name=${name}, price=${price}, image=${image}
        WHERE id=${id}
        RETURNING *
        `

        if(updateProduct.length === 0){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updateProduct[0],
        });

        
    } catch (error) {
        console.log("Error updating product", error);
        res.status(500).json({success: false, message:"Error updating the product"});
    }

};

export const deleteProduct = async(req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await sql`
        DELETE FROM products WHERE id=${id} RETURNING *
        `;

        if(deletedProduct.length === 0){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedProduct[0],
        })

    } catch (error) {
        console.log("Error deleting the product: ", product);
        res.status(500).json({success: false, message:"Error deleting the product"});
    }
};