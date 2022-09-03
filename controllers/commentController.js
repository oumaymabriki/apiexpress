const Center=require('../models/centerModel');
const Comment=require('../models/commentModel');
const mongoose=require('mongoose');

exports.allcomments=(req,res)=>{
	let centerId=req.params.centerId;
	if(!mongoose.Types.ObjectId.isValid(centerId)){
		return res.status(400).send({
	  		message:'Invalid center id',
	  		data:{}
	  	});
	}

	Center.findOne({_id:centerId}).then(async (center)=>{
		if(!center){
			return res.status(400).send({
				message:'No center of camping found',
				data:{}
			});	
		}else{

			try{
				let query=[
					{
						$lookup:
						{
						 from: "users",
						 localField: "iduser",
						 foreignField: "_id",
						 as: "user"
						}
					},
					{$unwind: '$user'},
					{
						$match:{
							'idcenter':mongoose.Types.ObjectId(centerId)
						}
					}
					
				];

				let total=await Comment.countDocuments(query);
				let page=(req.query.page)?parseInt(req.query.page):1;
				let perPage=(req.query.perPage)?parseInt(req.query.perPage):10;
				let skip=(page-1)*perPage;
				query.push({
					$skip:skip,
				});
				query.push({
					$limit:perPage,
				});

				let comments=await Comment.aggregate(query);
				return res.send({
		  		    message:'Comment successfully fetched',
			  		data:{
			  			comments:comments,
			  			meta:{
			  				total:total,
			  				currentPage:page,
			  				perPage:perPage,
			  				totalPages:Math.ceil(total/perPage)
		  			    }
			  		}
		  	    });

			}catch(err){
				return res.status(400).send({
			  		message:err.message,
			  		data:err
			  	});
			}

		}
	}).catch((err)=>{
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});
	})	
}

exports.addcomment=async (req,res)=>{
	let centerId=req.params.centerId;
	if(!mongoose.Types.ObjectId.isValid(centerId)){
		return res.status(400).send({
	  		message:'Invalid center id',
	  		data:{}
	  	});
	}
	Center.findOne({_id:centerId}).then(async (center)=>{
		if(!center){
			return res.status(400).send({
				message:'No centerCamping found',
				data:{}
			});	
		}else{

			try{
				

				let newCommentDocument= new Comment({
					content:req.body.content,
					iduser:req.user._id,
					idcenter:centerId
				});

				let commentData=await newCommentDocument.save();

				await Blog.updateOne(
					{_id:centerId},
					{
						$push: { comments :commentData._id  } 
					}
				)


				let query=[
					{
						$lookup:
						{
						 from: "users",
						 localField: "iduser",
						 foreignField: "_id",
						 as: "user"
						}
					},
					{$unwind: '$user'},
					{
						$match:{
							'_id':mongoose.Types.ObjectId(commentData._id)
						}
					},

				];

				let comments=await Comment.aggregate(query);

				return res.status(200).send({
					message:'Comment successfully added',
					data:comments[0]
				});


			}catch(err){
				return res.status(400).send({
			  		message:err.message,
			  		data:err
			  	});
			}

		
		}
	}).catch((err)=>{
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});
	})

}

exports.updatecomment=async (req,res)=>{
	let comment_id=req.params.comment_id;
	if(!mongoose.Types.ObjectId.isValid(comment_id)){
		return res.status(400).send({
	  		message:'Invalid comment id',
	  		data:{}
	  	});
	}

	Comment.findOne({_id:comment_id}).then(async (comment)=>{
		if(!comment){
			return res.status(400).send({
				message:'No comment found',
				data:{}
			});	
		}else{

			let current_user=req.user;

			if(comment.iduser!=current_user._id){
				return res.status(400).send({
					message:'Access denied',
					data:{}
				});	
			}else{

				try{

					await Comment.updateOne({_id:comment_id},{
						content:req.body.content
					});

					let query=[
						{
							$lookup:
							{
							 from: "users",
							 localField: "iduser",
							 foreignField: "_id",
							 as: "user"
							}
						},
						{$unwind: '$user'},
						{
							$match:{
								'_id':mongoose.Types.ObjectId(comment_id)
							}
						},

					];

					let comments=await Comment.aggregate(query);

					return res.status(200).send({
						message:'Comment successfully updated',
						data:comments[0]
					});


				}catch(err){
					return res.status(400).send({
				  		message:err.message,
				  		data:err
				  	});
				}
	
			}
		}
	}).catch((err)=>{
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});
	})
}