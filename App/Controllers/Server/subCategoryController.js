const { categoryModel } = require("../../Models/Server/categoryModel");
const { subCategoryModel } = require("../../Models/Server/subCategoryModel");

let addSubCategory = async (req, res) => {
    try {
        let saveSubCategory = await subCategoryModel.insertOne(req.body);

        res.send({
            status: 1,
            message: "SubCategory Added Successfully",
            data: saveSubCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}


let viewSubCategory = async (req, res) => {
    try {
        let subCategories = await subCategoryModel.find().populate('parentCategory')

        res.send({
            status: 1,
            message: "SubCategories Retrieved Successfully",
            data: subCategories,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}

let viewParentCategory = async (req, res) => {
    try {
        let parentCategories = await categoryModel.find({active: true}).select('name')

        res.send({
            status: 1,
            message: "Parent Category Data Retrieved Successfully",
            data: parentCategories,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}

let updateSubCategoryStatus = async (req, res) => {
    let paramId = req.params.id;
    try {
        let updateSubCategory = await subCategoryModel.updateOne(
            { _id: paramId }, 
            { $set: { active: req.body.status } });

        res.send({
            status: 1,
            message: "SubCategory Updated Successfully",
            data: updateSubCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }


}

let viewSingleSubCategory = async (req, res) => {
    let paramId = req.params.id;
    try {
        let subCategories = await subCategoryModel.find({ _id: paramId }).populate('parentCategory');

        res.send({
            status: 1,
            message: "SubCategories Retrieved Successfully",
            data: subCategories,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}


let deleteSubCategory = async (req, res) => {
    let {ids} = req.body;
    try {
        let deleteSubCategory = await subCategoryModel.deleteMany(
            { _id: { $in: ids } }
        );

        res.send({
            status: 1,
            message: "SubCategories Deleted Successfully",
            data: deleteSubCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}

let updateSubCategory = async (req, res) => {
    let paramId = req.params.id;
    try {
        let updateSubCategory = await subCategoryModel.updateOne(
            { _id: paramId }, 
            { $set: req.body });

        res.send({
            status: 1,
            message: "SubCategory Updated Successfully",
            data: updateSubCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}

module.exports = { viewSubCategory, addSubCategory, viewParentCategory, updateSubCategoryStatus, deleteSubCategory, updateSubCategory, viewSingleSubCategory }