const Center = require('../models/centerModel.js');
const asyncHandler = require('express-async-handler');



//@desc     REGISTER center
//@route    POST api/centers/register
//@access   isAdmin
exports.register = asyncHandler(async (req, res) => {
    const { centername, longitude, latitude, description } = req.body;

    const center = await Center.create({ centername, longitude, latitude, description});
  
    if (center) {
      res.status(201).json({
        _id: center._id,
        centername: center.centername,
        longitude: center.longitude,
        latitude: center.latitude,
        description: center.description,
      });
    } else {
      res.status(400);
      throw new Error('Invalid Center Data');
    }
  });


  //@desc     Get all centers
//@route    GET api/centers
//@access   All visitors
exports.getCenters = asyncHandler(async (req, res) => {
    const centers = await Center.find({});
    res.json(centers);
});

exports.updateCenters = asyncHandler(async (req, res) => {
    const center = await Center.findById(req.params.id);
  
    if (center) {
      center.centername = req.body.centername;
      center.longitude = req.body.longitude;
      center.latitude = req.body.latitude;
      if (req.body.description) {
        center.description = req.body.description;
      }
  
      const updatedCenter = await center.save();
      return res.json(updatedCenter);
    } else {
      res.status(404);
      throw new Error('Center not Found');
    }
  });


//@ get center for all visitors
exports.getCenter = asyncHandler(async (req, res) => {
    const center = await Center.findById(req.params.id);
    res.json(center);
});


//@ delete centers 
// @ PRIVATE / isAdmin
exports.deleteCenter = asyncHandler(async(req,res) =>{
    const center = await Center.findOneAndDelete({_id:req.params._id})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message:" Maybe center was not found!"
        });
      } else {
        res.send({
          message: "center was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err
      });
    });
});