const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        require: true,
        // trim: true
    }
}, {timestamps: true})
module.exports = mongoose.model("Category", categorySchema)

// _id field default by MongoDB - 24bit hex character
// timestamps: true - automatically add createdAt and updatedAt fields
// createdAt and updatedAt fields are automatically added by MongoDB - timestamp of when the document was created and last
