let mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
})

let categoryModel = mongoose.model("category", categorySchema, "category")
module.exports = { categoryModel }