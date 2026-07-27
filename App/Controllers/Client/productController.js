const { categoryModel } = require("../../Models/Server/categoryModel");
const { productCategoryModel } = require("../../Models/Server/productCategoryModel");
const { productModel } = require("../../Models/Server/productModel");
const { subCategoryModel } = require("../../Models/Server/subCategoryModel");

const getProductsByCategory = async (req, res) => {
    try {

        // ==========================================
        // PARAMS
        // ==========================================

        const {
            menuName,
            subCategory,
            productCategory,
        } = req.params;


        // ==========================================
        // QUERY FILTERS
        // ==========================================

        const {
            brand,
            sort,
            minPrice,
            maxPrice,
            minDiscount,
            maxDiscount,
        } = req.query;


        // ==========================================
        // PARENT CATEGORY
        // ==========================================

        const parentData =
            await categoryModel.findOne({
                name: new RegExp(`^${menuName}$`, "i"),
                active: true,
            });

        if (!parentData) {
            return res.send({
                status: 0,
                message: "Category Not Found",
                total: 0,
                data: [],
            });
        }


        // ==========================================
        // SUB CATEGORY
        // ==========================================

        const subData =
            await subCategoryModel.findOne({
                name: new RegExp(`^${subCategory}$`, "i"),
                parentCategory: parentData._id,
                active: true,
            });

        if (!subData) {
            return res.send({
                status: 0,
                message: "Sub Category Not Found",
                total: 0,
                data: [],
            });
        }


        // ==========================================
        // PRODUCT CATEGORY
        // ==========================================

        const productCatData =
            await productCategoryModel.findOne({
                name: new RegExp(
                    `^${productCategory}$`,
                    "i"
                ),
                subCategory: subData._id,
                active: true,
            });

        if (!productCatData) {
            return res.send({
                status: 0,
                message: "Product Category Not Found",
                total: 0,
                data: [],
            });
        }


        // ==========================================
        // BASE FILTER
        // ==========================================

        const filter = {
            parentCategory: parentData._id,
            subCategory: subData._id,
            productCategory: productCatData._id,
            active: true,
        };


        // ==========================================
        // BRAND FILTER
        // ==========================================

        if (brand) {

            const brands = brand
                .split(",")
                .map(item => item.trim())
                .filter(item => item);

            if (brands.length > 0) {

                filter.brand = {
                    $in: brands.map(
                        item => new RegExp(`^${item}$`, "i")
                    ),
                };

            }
        }


        // ==========================================
        // PRICE FILTER
        // ==========================================

        if (minPrice || maxPrice) {

            filter.sellingPrice = {};

            if (minPrice) {
                filter.sellingPrice.$gte =
                    Number(minPrice);
            }

            if (maxPrice) {
                filter.sellingPrice.$lte =
                    Number(maxPrice);
            }

        }


        // ==========================================
        // DISCOUNT FILTER
        // ==========================================

        if (minDiscount || maxDiscount) {

            filter.discountPercentage = {};

            if (minDiscount) {
                filter.discountPercentage.$gte =
                    Number(minDiscount);
            }

            if (maxDiscount) {
                filter.discountPercentage.$lte =
                    Number(maxDiscount);
            }

        }


        // ==========================================
        // SORTING
        // ==========================================

        let sortQuery = {};

        switch (Number(sort)) {

            // 1 = A to Z
            case 1:
                sortQuery = {
                    name: 1,
                };
                break;


            // 2 = Z to A
            case 2:
                sortQuery = {
                    name: -1,
                };
                break;


            // 3 = Latest Added
            case 3:
                sortQuery = {
                    createdAt: -1,
                };
                break;


            // 4 = Low Price to High Price
            case 4:
                sortQuery = {
                    sellingPrice: 1,
                };
                break;


            // 5 = High Price to Low Price
            case 5:
                sortQuery = {
                    sellingPrice: -1,
                };
                break;


            // Default
            default:
                sortQuery = {
                    createdAt: -1,
                };
                break;
        }


        // ==========================================
        // GET PRODUCTS
        // ==========================================

        const products =
            await productModel
                .find(filter)
                .sort(sortQuery);


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.send({
            status: 1,
            total: products.length,
            data: products,
        });


    } catch (error) {

        return res.send({
            status: 0,
            message: error.message,
            total: 0,
            data: [],
        });

    }
};
const getAllBrands = async (req, res) => {
    try {

        // ==========================================
        // Get All Unique Brands
        // ==========================================

        const brands = await productModel.aggregate([
            {
                $match: {
                    active: true,
                    brand: {
                        $exists: true,
                        $ne: "",
                        $ne: null,
                    },
                },
            },
            {
                $group: {
                    _id: "$brand",
                    slug: {
                        $first: "$brandSlug",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    slug: 1,
                },
            },
            {
                $sort: {
                    name: 1,
                },
            },
        ]);

        return res.send({
            status: 1,
            total: brands.length,
            data: brands,
        });

    } catch (error) {

        return res.send({
            status: 0,
            message: error.message,
            total: 0,
            data: [],
        });

    }
};

const getSingleProduct = async (req, res) => {
    try {

        const product =
            await productModel
                .findById(req.params.id)
                .populate("parentCategory")
                .populate("subCategory")
                .populate("productCategory");

        res.send({
            status: 1,
            data: product,
        });

    } catch (error) {

        res.send({
            status: 0,
            message: error.message,
        });

    }
};

const searchProducts = async (req, res) => {
    try {

        const { query } = req.query;

        if (!query || !query.trim()) {
            return res.send({
                status: 0,
                message: "Search keyword required",
                total: 0,
                data: [],
            });
        }

        const keyword = query.trim().toLowerCase();

        // Search ko words me tod do
        const words = keyword.split(/\s+/);

        // Har word ko regex banao
        const regex = words.map(word => new RegExp(word, "i"));

        const products = await productModel.find({
            active: true,
            $or: [
                { name: { $in: regex } },
                { slug: { $in: regex } },
                { brand: { $in: regex } },
                { description: { $in: regex } },
                { fabric: { $in: regex } },
                { fit: { $in: regex } },
                { sleeve: { $in: regex } },
                { neck: { $in: regex } },
                { pattern: { $in: regex } },
                { occasion: { $in: regex } },
                { countryOfOrigin: { $in: regex } },
            ],
        }).sort({ createdAt: -1 });

        return res.send({
            status: 1,
            total: products.length,
            data: products,
        });

    } catch (error) {

        return res.send({
            status: 0,
            message: error.message,
            total: 0,
            data: [],
        });

    }
};





module.exports = {
    getProductsByCategory,getSingleProduct ,searchProducts,getAllBrands,searchProducts
};