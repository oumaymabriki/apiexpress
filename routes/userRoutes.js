const express = require("express"); 
const { Verif, getUsers,
  login,
  register,
  updateUserProfile } = require("../controllers/userController.js");
router = express.Router();

const admin = require('../middlewares/authMiddelware');
const protect = require('../middlewares/authMiddelware');


router.post('/register', register);
router.post('/verif', Verif);
router.post('/login', login);
router.get('/', protect, admin, getUsers);
router.put('/:id', protect, updateUserProfile);
module.exports = router;