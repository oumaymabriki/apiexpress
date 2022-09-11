var mongoose = require("mongoose");
var schema = mongoose.Schema;

const centerSchema = new schema({
    centername : String,
    longitude:Number,
    latitude:Number,
    images:{required: false, type:String},
    description:String,
    //comments: [{type: schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model("Center", centerSchema);