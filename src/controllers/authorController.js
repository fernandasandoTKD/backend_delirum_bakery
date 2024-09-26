const bcrypt = require ('bcryptjs')
const jwt = require ("jsonwebtoken")
const fs  =require ('fs')
const path =require ('path')
const {v4: uuid} = require ("uuid")

const Author = require ('../models/author')
const HttpError =require ("../models/error")

/*Register a new author */
// POST : api/author/register
// UNPROTECTED 
const registerAuthor = async (req, res, next ) => {
    try {
        const {name, email, password, password2} = req.body;
        if (!name || !email || !password) {
            return next ( new HttpError (" Fill in all fields" , 422))
        }
        const newEmail = email.toLowerCase ()

        const emailExists = await Author.findOne ({email: newEmail})
        if (emailExists) {
            return next(new HttpError ("Email already exsist." , 422))
        }
        if ((password.trim ()) . lenth <6 ) {
            return next (new HttpError ("Password should be at least 6 characters." , 422))

        }
        if (password != password2) {
            return next ( new HttpError ("Passwords do not match." , 422))
        }

        const salt = await bcrypt.genSalt (10) 
        const hashedPass = await bcrypt.hash (password, salt);
        const newAuthor = await Author.create ({name, email: newEmail, password: hashedPass})
        res.status (201).json(`New author ${newAuthor.email} registered`)
    } catch (error) {
        return next (new HttpError(" Author registration failed." , 422))
    }
}

/*Login a Registered Author */
// POST : api/author/login
// UNPROTECTED 
const loginAuthor = async (req, res, next ) => {
    try {
        const {email, password} =req.body;
        if (!email || !password) {
            return next (new HttpError ("fill in all fields." 422))
        }
        const newEmail =email.toLowerCase();
        const author = await Author.findOne ({email: newEmail})
        if (!author) {
            return next (new HttpError("Invalid credentials .", 422))
        
        }
        const comparePass =await bcrypt.compare(password, author.password)
        if (!comparePass) {
            return next( new HttpError ("invalid credentiales ." ,422))
        }

        const {id: id, name} = author;
        const token = jwt.sign ({id, name}, ProcessingInstruction.env.JWT_SECRET, {})

        res.status (200).json({token, id, name})

    } catch (error) {
        return next (new HttpError ("Login failed. Please check your credentiales." 422))
    }
}

/* Author Profile */
// POST : api/author/:id
// PROTECTED 
const getAuthor = async (req, res, next ) => {
    try {
        const {id} = req.params;
        const author = await Author.findbyId(id).select ('-password');
        if (!author){
            return next (new HttpError("author not found" , 404)) 
        }
        res.status(200).json(author);


    } catch (error) {
        return next (new HttpError (error))
    }
}

/* Change Author Avatar (profile picture) */
// POST : api/author/change-avatar
// PROTECTED 
const changeAvatar = async (req, res, next ) => {
    try {
        if (!req.files.avatar){
            return next (new HttpError ("Please choose an image." , 422))
        }

        //find author from database 
        const author = await Author.findById (req.author.id)
        // delete old avatar if exists 
        if (author.avatar){
            fs.unlink (path.join(__dirname, '..', 'uploads', author.avatar), (err) =>{
                if (err) {
                    return next (new HttpError(err) )
                }
            })
        }
        const {avatar} = req.files;
        //check file size 
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture too big. Should be less than 500kb"), 422)
        }
        let fileName;
        fileName = avatar.name;
        let splittedFilename = fileName.split ('.')
        let newFilename = splittedFilename[0] + uuid () + '.' + splittedFilename[splittedFilename.length - 1]
        avatar.mv (path.join (__dirname, '..', 'uploads', newFilename), async (err) =>{
            if (err){
                return next(new HttpError(err))
            }

            c

            const updatedAvatar = await Author,findByIdAndUpdate(req.author.id, {avatar: newFilename}, {new:true} )
            if (!updatedAvatar) {
                return next (new HttpError ("Avatar couldn't be changed." , 422)
            }
            res.status(200).json(updatedAvatar)
        })
    }catch (error) {
        return next (new HttpError (error))
    }
}

/* Edit Author Details  (from profile) */
// POST : api/author/edit-author
// PROTECTED 
const editAuthor = async (req, res, next ) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if (!name || !email || !currentPassword || !newPassword) {
            return next (new HttpError("Fill in in all fields." , 422))
        }
        //get author from database
        const author = await Author.findByID (req.author.id);
        if (!author) {
            return next (new HttpError ("Author not found", 403))
        }
        // make sure new email doesn't already exist 
        const emailExists = await Author.findOne ({email});
        if (emailExists && (emailExists._id != req.user,id)) {
            return next (new HttpError ("Email already exists.",422 ))
        }
        //Compare current password to db password
        const validateAuthorPassword = await bcrypt. compare (currrentPassword, author.password);
        if (!validateAuthorPassword) {
            return next( new HttpError ("Invalid current password", 422 ))
        }
        //Compare new passwords 
        if (newPassword !== confirmNewPassword){
            return next (new HttpError ("New passwords do not match", 422))
        }

        //hash new password 
        const salt = await bcrypt.genSalt (10)
        const hash = await bcrypt.hash(newPassword, salt);

        //update author info database
        const newInfo = await  Author.findByIdAndUpdate (req.author.id, {name, email, password: hash}, {new:true})
        req.status(200).json (newInfo)

    } catch (error) {
        return next (new HttpError(error))
    }
}

/* Get Authors  */
// POST : api/authors/authorsuser
// UNPROTECTED 
const getAuthors_User = async (req, res, next ) => {
    try {
        const authors_user = await Author.find().select('-password ');
        res.json (authors_user);
    } catch (error) {
        return next (new HttpError (error))
    }
}

module.exports ={registerAuthor , loginAuthor , getAuthor , changeAvatar, editAuthor, getAuthors_User }