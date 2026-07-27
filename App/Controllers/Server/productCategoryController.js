const { productCategoryModel } = require("../../Models/Server/productCategoryModel");
const { subCategoryModel } = require("../../Models/Server/subCategoryModel");

let addProductCategory = async (req, res) => {
    try {
        let saveProductCategory = await productCategoryModel.insertOne(req.body);

        res.send({
            status: 1,
            message: "Product Category Added Successfully",
            data: saveProductCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}


let viewProductCategory = async (req, res) => {
    try {
        let productCategories = await productCategoryModel.find().populate('parentCategory').populate('subCategory')

        res.send({
            status: 1,
            message: "Product Categories Retrieved Successfully",
            data: productCategories,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}

let updateProductCategory = async (req, res) => {
    let paramId = req.params.id;
    try {
        let updateProductCategory = await productCategoryModel.updateOne(
            { _id: paramId }, 
            { $set: req.body });

        res.send({
            status: 1,
            message: "Product Category Updated Successfully",
            data: updateProductCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}

let viewSingleProductCategory = async (req, res) => {
    let paramId = req.params.id;
    try {
        let productCategories = await productCategoryModel.find({ _id: paramId }).populate('parentCategory').populate('subCategory');

        res.send({
            status: 1,
            message: "Product Categories Retrieved Successfully",
            data: productCategories,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}

let getSubCategoryByParent = async (req, res) => {
    try {

        const parentId = req.params.parentId;

        const subCategory = await subCategoryModel.find({
            parentCategory: parentId,
            active: true
        }).select("name");

        res.send({
            status: 1,
            message: "Sub Categories Found",
            data: subCategory
        });

    } catch (error) {

        res.send({
            status: 0,
            message: error.message
        });

    }
};


let updateProductCategoryStatus = async (req, res) => {
    let paramId = req.params.id;
    try {
        let updateProductCategory = await productCategoryModel.updateOne(
            { _id: paramId }, 
            { $set: { active: req.body.status } });

        res.send({
            status: 1,
            message: "Product Category Updated Successfully",
            data: updateProductCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }


}

let deleteProductCategory = async (req, res) => {
    let {ids} = req.body;
    try {
        let deleteProductCategory = await productCategoryModel.deleteMany(
            { _id: { $in: ids } }
        );

        res.send({
            status: 1,
            message: "Product Categories Deleted Successfully",
            data: deleteProductCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}






module.exports = { viewProductCategory,deleteProductCategory, updateProductCategoryStatus, addProductCategory, updateProductCategory, viewSingleProductCategory,getSubCategoryByParent }