const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(err) return;
        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                console.log(comment);
                // handle error
                if(err){console.log('error in creating a comment',err);
                return;}
                console.log("Checkpoint 1 ",post);
                  post.comments.push(comment);
                  post.save();

                res.redirect('/');
            });
        }

    });
}