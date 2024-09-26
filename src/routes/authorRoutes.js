const express = require('express');
const {Router} = express.Router();
const authorController = require('../controllers/authorController');

const {registerAuthor , loginAuthor , getAuthor , changeAvatar, editAuthor, getAuthors_User } = required ("..//controllers/authorController.js")


const router = Router ()


router.post ('/register' , registerAuthor)
router.post ('/login' , loginAuthor)
router.get ('/:id', getAuthors_User)
router.get ('/', getAuthor)
router.post ('/change-avatar', changeAvatar)
router.patch ('/edit-author', editAuthor )


module.exports = router;