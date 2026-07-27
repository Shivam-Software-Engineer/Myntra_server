const {
    cartModel,
} = require("../../Models/Cleint/cartModel");


const {
    productModel,
} = require("../../Models/Server/productModel");


// ==================================================
// ADD TO CART
// ==================================================

const addToCart = async (
    req,
    res
) => {

    try {

        // ==========================================
        // GET REQUEST DATA
        // ==========================================

        const {

            productId,

            size,

            color,

            quantity = 1,

        } = req.body;


        // ==========================================
        // GET LOGGED IN USER
        // ==========================================

        const user =
            req.user.userId;


        // ==========================================
        // VALIDATE USER
        // ==========================================

        if (!user) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "User is required",

            });

        }


        // ==========================================
        // VALIDATE PRODUCT
        // ==========================================

        if (!productId) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "Product is required",

            });

        }


        // ==========================================
        // VALIDATE QUANTITY
        // ==========================================

        const requestedQuantity =
            Number(quantity);


        if (
            !Number.isInteger(
                requestedQuantity
            ) ||
            requestedQuantity < 1
        ) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "Invalid quantity",

            });

        }


        // ==========================================
        // FIND PRODUCT
        // ==========================================

        const product =
            await productModel.findById(
                productId
            );


        if (!product) {

            return res.status(404).json({

                status:
                    0,

                message:
                    "Product not found",

            });

        }


        // ==========================================
        // CHECK PRODUCT STOCK
        // ==========================================

        if (
            Number(product.stock) <
            requestedQuantity
        ) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "Insufficient stock",

            });

        }


        // ==========================================
        // NORMALIZE SIZE & COLOR
        // ==========================================

        const selectedSize =
            size || "";


        const selectedColor =
            color || "";


        // ==========================================
        // FIND EXISTING CART ITEM
        // ==========================================
        // Same:
        // User + Product + Size + Color
        // ==========================================

        const existingCart =
            await cartModel.findOne({

                user,

                productId,

                size:
                    selectedSize,

                color:
                    selectedColor,

            });


        // ==========================================
        // IF CART ITEM ALREADY EXISTS
        // ==========================================

        if (existingCart) {

            const newQuantity =

                Number(
                    existingCart.quantity
                ) +

                requestedQuantity;


            // ==========================================
            // CHECK STOCK
            // ==========================================

            if (
                newQuantity >
                Number(product.stock)
            ) {

                return res.status(400).json({

                    status:
                        0,

                    message:
                        "Requested quantity exceeds available stock",

                });

            }


            // ==========================================
            // UPDATE QUANTITY
            // ==========================================

            existingCart.quantity =
                newQuantity;


            // ==========================================
            // UPDATE LATEST PRODUCT DETAILS
            // ==========================================

            existingCart.productName =
                product.name;


            existingCart.productImage =
                product.image;


            existingCart.brand =
                product.brand;


            existingCart.mrpPrice =
                product.mrpPrice;


            existingCart.sellingPrice =
                product.sellingPrice;


            existingCart.discountPercentage =
                product.discountPercentage;


            // ==========================================
            // SAVE CART
            // ==========================================

            await existingCart.save();


            return res.status(200).json({

                status:
                    1,

                message:
                    "Cart quantity updated successfully",

                data:
                    existingCart,

            });

        }


        // ==========================================
        // CREATE NEW CART ITEM
        // ==========================================

        const cart =
            await cartModel.create({

                user,

                productId,

                productName:
                    product.name,

                productImage:
                    product.image,

                brand:
                    product.brand,

                mrpPrice:
                    product.mrpPrice,

                sellingPrice:
                    product.sellingPrice,

                discountPercentage:
                    product.discountPercentage,

                size:
                    selectedSize,

                color:
                    selectedColor,

                quantity:
                    requestedQuantity,

            });


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(201).json({

            status:
                1,

            message:
                "Product added to cart successfully",

            data:
                cart,

        });


    } catch (error) {

        console.error(
            "Add To Cart Error:",
            error
        );


        return res.status(500).json({

            status:
                0,

            message:
                "Something went wrong",

            error:
                error.message,

        });

    }

};



// ==================================================
// REMOVE FROM CART
// ==================================================

const removeFromCart = async (
    req,
    res
) => {

    try {

        // ==========================================
        // GET USER
        // ==========================================

        const user =
            req.user.userId;


        // ==========================================
        // GET REQUEST DATA
        // ==========================================

        const {

            productId,

            size,

            color,

        } = req.body;


        // ==========================================
        // VALIDATE PRODUCT
        // ==========================================

        if (!productId) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "Product is required",

            });

        }


        // ==========================================
        // FIND AND REMOVE EXACT CART ITEM
        // ==========================================

        const cartItem =

            await cartModel.findOneAndDelete({

                user,

                productId,

                size:
                    size || "",

                color:
                    color || "",

            });


        // ==========================================
        // CART ITEM NOT FOUND
        // ==========================================

        if (!cartItem) {

            return res.status(404).json({

                status:
                    0,

                message:
                    "Product not found in cart",

            });

        }


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({

            status:
                1,

            message:
                "Product removed successfully",

            data:
                cartItem,

        });


    } catch (error) {

        console.error(
            "Remove Cart Error:",
            error
        );


        return res.status(500).json({

            status:
                0,

            message:
                "Something went wrong",

            error:
                error.message,

        });

    }

};



// ==================================================
// UPDATE CART QUANTITY
// ==================================================

const updateCartQuantity = async (
    req,
    res
) => {

    try {

        // ==========================================
        // GET USER
        // ==========================================

        const user =
            req.user.userId;


        // ==========================================
        // GET REQUEST DATA
        // ==========================================

        const {

            productId,

            size,

            color,

            quantity,

        } = req.body;


        // ==========================================
        // VALIDATE PRODUCT
        // ==========================================

        if (!productId) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "Product is required",

            });

        }


        // ==========================================
        // VALIDATE QUANTITY
        // ==========================================

        const newQuantity =
            Number(quantity);


        if (
            !Number.isInteger(
                newQuantity
            ) ||
            newQuantity < 1
        ) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "Quantity must be at least 1",

            });

        }


        // ==========================================
        // FIND PRODUCT
        // ==========================================

        const product =
            await productModel.findById(
                productId
            );


        if (!product) {

            return res.status(404).json({

                status:
                    0,

                message:
                    "Product not found",

            });

        }


        // ==========================================
        // CHECK STOCK
        // ==========================================

        if (
            newQuantity >
            Number(product.stock)
        ) {

            return res.status(400).json({

                status:
                    0,

                message:
                    "Requested quantity exceeds available stock",

            });

        }


        // ==========================================
        // FIND EXACT CART ITEM
        // ==========================================

        const cartItem =

            await cartModel.findOne({

                user,

                productId,

                size:
                    size || "",

                color:
                    color || "",

            });


        // ==========================================
        // CART ITEM NOT FOUND
        // ==========================================

        if (!cartItem) {

            return res.status(404).json({

                status:
                    0,

                message:
                    "Product not found in cart",

            });

        }


        // ==========================================
        // UPDATE QUANTITY
        // ==========================================

        cartItem.quantity =
            newQuantity;


        // ==========================================
        // SAVE
        // ==========================================

        await cartItem.save();


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({

            status:
                1,

            message:
                "Cart quantity updated successfully",

            data:
                cartItem,

        });


    } catch (error) {

        console.error(
            "Update Cart Quantity Error:",
            error
        );


        return res.status(500).json({

            status:
                0,

            message:
                "Something went wrong",

            error:
                error.message,

        });

    }

};



// ==================================================
// GET CART
// ==================================================

const getCart = async (
    req,
    res
) => {

    try {

        // ==========================================
        // GET USER
        // ==========================================

        const user =
            req.user.userId;


        // ==========================================
        // GET USER CART
        // ==========================================

        const cart =
            await cartModel

                .find({
                    user,
                })

                .populate(
                    "productId"
                )

                .sort({
                    createdAt:
                        -1,
                });


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({

            status:
                1,

            data:
                cart,

        });


    } catch (error) {

        console.error(
            "Get Cart Error:",
            error
        );


        return res.status(500).json({

            status:
                0,

            message:
                error.message,

        });

    }

};



// ==================================================
// EXPORT
// ==================================================

module.exports = {

    addToCart,

    removeFromCart,

    updateCartQuantity,

    getCart,

};