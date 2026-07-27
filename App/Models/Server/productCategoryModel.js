let mongoose = require('mongoose')

let productCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategory',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
})

let productCategoryModel = mongoose.model("productcategory", productCategorySchema, "productcategory")
module.exports = { productCategoryModel }
