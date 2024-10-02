const express = require('express');
const router = express.Router();
const {registerAuthor , loginAuthor , getAuthor , changeAvatar, editAuthor, getAuthors} = require ("../controllers/authorController.js")
const authMiddleware = require ('../middleware/authMiddleware')



router.post('/register' , registerAuthor)
router.post('/login' , loginAuthor)
router.get('/:id', getAuthor)
router.get('/', getAuthors)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-author', authMiddleware, editAuthor )


module.exports = router;