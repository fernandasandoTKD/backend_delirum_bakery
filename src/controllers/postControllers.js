const Post = require ('../models/postModel')
const Author = require ("../models/author")
const path = require ('path')
const fs = require ('fs')
const {v4: uuid} = require('uuid')
const HttpError = require ( '../models/error')



// Create a Post
//Post : api/posts
//Protected

const createPost = async (req,res, next ) => {
    try{
       
        let {title, category, description} = req.body;
        if(!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
        }
        const {thumbnail} = req.files;
        //chech the  file size
        if(thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big. File should be less than 2mb"))
        }
        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "."  + splittedFilename[splittedFilename.length -1]
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFilename), async (err) => {
            if(err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({title, category, description, thumbnail: newFilename, creator: req.author.id})
                if(!newPost) {
                    return next(new HttpError("Post couldn't be create." , 422))
                }
                //find author and increase post count by 1
                const currentAuthor = await  Author.findById(req.author.id);
                const authorPostCount = currentAuthor.posts + 1;
                await Author.findByIdAndUpdate(req.author.id, {posts: authorPostCount})

                res.status(201).json(newPost)
            }
        })
    }catch (error ) {
        return next(new HttpError(error))
    }
}

// Get all a Post 
//Post : api/posts
//Unprotected 

const getPosts= async (req,res, next ) =>{
    
    try {
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)

    } catch (error) {
        return next(new HttpError(error))
    }
}

// Get sigle Post 
//Get : api/posts/:id
//Unprotected 

const getPost = async (req,res, next ) =>{
    try {
        const postId= req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found", 404))
        }
        res.status(200).json(post)
    } catch (error){
        return next(new HttpError (error))
    }
}   

// Get Posts by category
//Get : api/posts/categories/:category
//Unprotected 

const getCatPosts = async (req,res, next ) => {
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// get Author/ post
const getAuthorPosts = async (req, res, next) => {
    try {
        const {id} = req.params; 
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.status(200).json(posts)
        
    } catch (error) {
        return next(new HttpError(error))
    }
}


// Edit Post
//Patch : api/posts/:id
//protected 

const editPost = async (req,res, next ) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let {title, category, description} = req.body;
   
        
        if(!title || !category || description.length < 12) {
            return next(new HttpError("fill in all fields", 422))
        }
        if(!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description}, {new:true})
        } else {
            //get old post from database
            const oldPost = await Post.findById(postId);
            if(req.user.id == oldPost.creator) {
                if(!req.files) {
                    updatePost = await Post.findByIdAndUpdate (postId, {title, category, description} ,  {new:true})
                } else {
                    //delete old thumbnail from upload
                    fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                        if (err) {
                            return next(new HttpError(err))
                        }
                    })
                    //upload new thumbnail
                    const {thumbnail} = req.files;
                    //check file size
                    if(thumbnail.size > 2000000) {
                        return next(new HttpError("Thumbnail too big. Should be less than 2mb"))
                    }
                    fileName = thumbnail.name;
                    let splittedFilename = fileName.split ('.')
                    newFilename = splittedFilename[0] + uuid() + "." + splittedFilename [splittedFilename.length -1]
                    thumbnail.mv(path.join(__dirname, '..', 'uploads' , newFilename), async (err) => {
                        if(err) {
                            return next(new HttpError(err))
                        }
                    })

                    updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description, thumbnail: newFilename}, {new: true })
       
        }

        if(!updatedPost) {
            return next (new HttpError("Couldn't update post.", 400))
        }
        res.status(200).json(updatedPost)
    }}

     } catch (error) {
        return next (new HttpError(error))
    }
}

// Delete Post
//Delete : api/posts/:id
//protected 

const deletePost = async (req,res, next ) =>{
    try {
        const postId =req.params.id;
        if(!postId) {
            return next(new HttpError("Post unavailable.",400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        if (req.author.id == post.creator)  {
        //delete thumbnail from uploads folder
        fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
            if(err) {
                return next(new HttpError(err))
            } else {
                    await Post.findByIdAndDelete(postId);
                    //Find auhotr and reduce post count by 1
                    const currentAuthor = await Author.findById(req.author.id);
                    const authorPostCount = currentAuthor?.posts -1;
                    await  Author.findByIdAndUpdate(req.author.id, {posts: authorPostCount})
                    res.json(`Post ${postId} deleted succesfully.`)
            }
        })
        
    } else {
        return next(new HttpError("Post couldn't be deleted", 403))
    } 
        
    } catch (error) {
        return next(new HttpError(err))
        
    }
}





module.exports = {createPost, getPosts, getPost, getCatPosts, getAuthorPosts, editPost, deletePost}