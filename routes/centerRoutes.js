const express = require("express"); 
const { getCenter, deleteCenter,updateCenters,register,getCenters } = require("../controllers/centerController.js");
router = express.Router();


const admin = require('../middlewares/authMiddelware');
const protect = require('../middlewares/authMiddelware');

router.post('/register',admin, register);
router.get('/', getCenters);
router.get('/:id',getCenter);
router.put('/:id', protect,admin, updateCenters);
router.delete('/:id', protect, admin, deleteCenter);
module.exports = router;