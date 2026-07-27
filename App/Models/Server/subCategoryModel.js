let mongoose = require('mongoose')

let subCategorySchema = mongoose.Schema({
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
    active: {
        type: Boolean,
        default: true
    },
})

let subCategoryModel = mongoose.model("subcategory", subCategorySchema, "subcategory")
module.exports = { subCategoryModel }
