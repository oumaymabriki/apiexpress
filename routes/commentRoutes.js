const express = require("express"); 
const { addcomment, allcomments,updatecomment } = require("../controllers/commentController.js");
router = express.Router();

const admin = require('../middlewares/authMiddelware');
const protect = require('../middlewares/authMiddelware');


router.post('/register', addcomment);
router.get('/', protect, allcomments);
router.put('/:id', protect, admin,updatecomment);
module.exports = router;