const { categoryModel } = require("../../Models/Server/categoryModel");

let addCategory = async (req, res) => {
    try {
        let saveCategory = await categoryModel.insertOne(req.body);

        res.send({
            status: 1,
            message: "Category Added Successfully",
            data: saveCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}


let viewCategory = async (req, res) => {
    try {
        let categories = await categoryModel.find() ;

        res.send({
            status: 1,
            message: "Categories Retrieved Successfully",
            data: categories,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}


let viewSingleCategory = async (req, res) => {
    let paramId = req.params.id;
    try {
        let categories = await categoryModel.find({ _id: paramId });

        res.send({
            status: 1,
            message: "Categories Retrieved Successfully",
            data: categories,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}


let updateCategory = async (req, res) => {
    let paramId = req.params.id;
    try {
        let updateCategory = await categoryModel.updateOne(
            { _id: paramId }, 
            { $set: req.body });

        res.send({
            status: 1,
            message: "Category Updated Successfully",
            data: updateCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}


let updateCategoryStatus = async (req, res) => {
    let paramId = req.params.id;
    try {
        let updateCategory = await categoryModel.updateOne(
            { _id: paramId }, 
            { $set: { active: req.body.status } });

        res.send({
            status: 1,
            message: "Category Updated Successfully",
            data: updateCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}

let deleteCategory = async (req, res) => {
    let {ids} = req.body;
    try {
        let deleteCategory = await categoryModel.deleteMany(
            { _id: { $in: ids } }
        );

        res.send({
            status: 1,
            message: "Categories Deleted Successfully",
            data: deleteCategory,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}

module.exports = { viewCategory, addCategory, viewSingleCategory, updateCategory, updateCategoryStatus, deleteCategory }