// comment model 
var mongoose = require("mongoose");
var schema = mongoose.Schema;
//create o comment model in mongodb 
const commentSchema = new schema({
    content: String,
    iduser:{type:mongoose.Types.ObjectId, ref:'users'},
    idcenter:{type:mongoose.Types.ObjectId, ref:'centers'}
});
module.exports = mongoose.model("Comment", commentSchema);