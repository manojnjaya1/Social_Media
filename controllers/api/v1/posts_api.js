const Post=require('../../../models/post');
const Comment=require('../../../models/comment'); 
module.exports.index= async function(req,res){

    let posts = await Post.find({})
    .sort('-createdAt')
       .populate('user')
       .populate({
          path: 'comments',
          populate: {
             path: 'user'
          }
       });

    return res.json(200,{
        message:"list of posts",
        posts:posts
    });
}
module.exports.destroy = async function (req, res) {
   
    console.log(req.user.id);
    console.log("a******");
    try {
        let post = await Post.findById(req.params.id);
        console.log(post);
       if (post.user == req.user.id) {
       // console.log(user);
       // console.log(post);
            post.remove();
            await Comment.deleteMany({ post: req.params.id });
           
            // req.flash('success','Post Deleted');
            return res.json(200,{
                message:"Post and assosiated comments deleted successfully"
            });
        }
        else {
           return res.json(401,{
            message:"You cannot delete this post "
           });
        }
    } catch (err) {
        // req.flash('error','err');
        // return res.redirect('back');
        console.log("error1 :" ,err);
        return res.json(500,{
            message:"internal server error"
        })
        
    }

}