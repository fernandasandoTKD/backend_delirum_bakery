const {Schema, model} = require ("mongoose")

const postSchema = new Schema ({
    title: {type: String, require: true },
    category: {type: String, enum: ["Historia", "Panes del mundo", "Tortas artesanales", "arte en galletas"], message: "{VALUE is not supported"},
    drescription: {type: String, require: true },
    creator: {type: String, require: true },
    thumbnail: {type: String, required: true },

}, {timestamps: true})

module.exports = model("Post", postSchema)