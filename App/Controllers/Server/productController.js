const { productCategoryModel } = require("../../Models/Server/productCategoryModel");
const { productModel } = require("../../Models/Server/productModel");
const slugify = require("slugify");

const addProduct = async (req, res) => {
  try {
    const existingProduct = await productModel.findOne({
      name: req.body.name,
      productCategory: req.body.productCategory,
    });

    if (existingProduct) {
      return res.send({
        status: 0,
        message: "Product already exists.",
      });
    }

    // Generate Slug
    req.body.slug = slugify(req.body.name, {
      lower: true,
      strict: true,
    });

    const saveProduct = await productModel.create(req.body);

    res.send({
      status: 1,
      message: "Product Added Successfully",
      data: saveProduct,
    });
  } catch (error) {
    res.send({
      status: 0,
      message: error.message,
    });
  }
};


let viewProduct = async (req, res) => {
    try {
        let product = await productModel.find().populate('parentCategory').populate('subCategory').populate('productCategory')

        res.send({
            status: 1,
            message: "Product Retrieved Successfully",
            data: product,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}

let viewSingleProduct = async (req, res) => {
    let paramId = req.params.id;
    try {
        let product = await productModel.find({ _id: paramId }).populate('parentCategory').populate('subCategory').populate('productCategory');

        res.send({
            status: 1,
            message: "Product  Retrieved Successfully",
            data: product,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}

let getProductCategoryBySubCategory = async (req, res) => {
    try {

        const subCateId = req.params.subCateId;

        const productCategory = await productCategoryModel.find({
            subCategory: subCateId,
            active: true
        }).select("name");

        res.send({
            status: 1,
            message: "Product Categories Found",
            data: productCategory
        });

    } catch (error) {

        res.send({
            status: 0,
            message: error.message
        });

    }
};

let updateProduct = async (req, res) => {
    let paramId = req.params.id;
    try {
        let updateProduct = await productModel.updateOne(
            { _id: paramId }, 
            { $set: req.body });

        res.send({
            status: 1,
            message: "Product Updated Successfully",
            data: updateProduct,
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}


module.exports = {
  addProduct,viewProduct,getProductCategoryBySubCategory,viewSingleProduct,updateProduct
};