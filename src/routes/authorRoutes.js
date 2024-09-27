const express = require('express');
const router = express.Router();


const {registerAuthor , loginAuthor , getAuthor , changeAvatar, editAuthor, getAuthors_User } = require ("../controllers/authorController.js")
const authMiddleware = require ('../middleware/authMiddleware')




router.post ('/register' , registerAuthor)
router.post ('/login' , loginAuthor)
router.get ('/:id', getAuthors_User)
router.get ('/', getAuthor)
router.post ('/change-avatar', authMiddleware, changeAvatar)
router.patch ('/edit-author', editAuthor )


module.exports = router;