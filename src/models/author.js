const {Schema, model} = require ('mongoose')

const authorSchema = new Schema ({
    username: {type: String, required: true},
    email:{ type: String, required: true},
    password: {type: String, required:true},
    avatar:{type:String},
    posts: {type: Number, default: 0 }


})

module.exports = model ('Author' , authorSchema) 