const express = require("express"); 

const { Verif, getUsers,
  login,
  register,
  updateUserProfile,
  findOne,
  deleteOne,
} = require("../controllers/userController.js");
const {check} = require('express-validator');
const Password = require('../controllers/password.js');
router = express.Router();

const admin = require('../middlewares/authMiddelware');
const protect = require('../middlewares/authMiddelware');


router.post('/register', register);
router.post('/verif', Verif);
router.post('/login', login);
router.get('/', protect, admin, getUsers);
router.put('/:id', protect, updateUserProfile);
router.get('/:id', protect, findOne);
router.delete('/:id', protect,admin, deleteOne);
//reset password with sendGrid
//Password RESET
router.post('/recover', [
  check('email').isEmail().withMessage('Enter a valid email address'),
], Password.recover);
router.get('/reset/:token', Password.reset);
router.post('/reset/:token', [
  check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
  check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
], Password.resetPassword);


module.exports = router;