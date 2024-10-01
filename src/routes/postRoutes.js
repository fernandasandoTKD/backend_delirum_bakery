const {Router } = require ('express')

const {createPost, getPosts, getPost, getCatPosts, getAuthorPosts, editPost,deletePost} = require('../controllers/postControllers')
const authMiddleware = require('../middleware/authMiddleware')
const verifyToken = require ('../middlewares/auth')

const router = Router ()

router.post('/', verifyToken, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/categories/:category', getCatPosts)
router.get('/authors/:id', getAuthorPosts)
router.patch('/:id', verifyToken, editPost)
router.delete('/:id', verifyToken, deletePost)

module.exports = router;