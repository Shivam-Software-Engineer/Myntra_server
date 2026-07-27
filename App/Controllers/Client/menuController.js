const { categoryModel } = require("../../Models/Server/categoryModel");
const { productCategoryModel } = require("../../Models/Server/productCategoryModel");
const { subCategoryModel } = require("../../Models/Server/subCategoryModel");

const getMenuData = async (req, res) => {
    try {
        const { menuName } = req.params;

        // Find Parent Category
        const parentCategory = await categoryModel.findOne({
            name: {
                $regex: new RegExp(`^${menuName}$`, "i"),
            },
            active: true,
        }).select("name");

        if (!parentCategory) {
            return res.send({
                status: 0,
                message: "Category Not Found",
            });
        }

        // Get All Active Sub Categories
        const subCategories = await subCategoryModel.find({
            parentCategory: parentCategory._id,
            active: true,
        }).select("name image");

        // Get All Active Product Categories
        const productCategories = await productCategoryModel
            .find({
                parentCategory: parentCategory._id,
                active: true,
            })
            .populate("subCategory", "name")
            .select("name image subCategory");

        res.send({
            status: 1,
            message: "Menu Data Fetched Successfully",

            data: {
                category: parentCategory,

                subCategories,

                productCategories,
            },
        });
    } catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
};

module.exports = {
    getMenuData,
};