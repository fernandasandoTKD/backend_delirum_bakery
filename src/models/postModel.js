const {Schema, model} = require("mongoose")

const postSchema = new Schema({
    title: {type: String, required: true },
    category: {type: String, enum: ["Nuestra Historia", "Panes del mundo", "Tortas Artesanales", "Arte en galletas"], message: "{VALUE is not supported"},
    description: {type: String, required: true },
    creator: {type: Schema.Types.ObjectId, ref:"Author"},
    thumbnail: {type: String, required: true },

}, {timestamps: true})

module.exports = model('Post', postSchema)