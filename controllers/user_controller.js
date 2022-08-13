const User = require('../models/user')
const mongoose=require('mongoose');
const fs=require('fs');
const path=require('path');

module.exports.profile = function (req, res) {
  
    User.findById(req.params.id, function (err, user) {
      
        return res.render('user_profile', {
            
            title: " User Profile",
            profile_user: user
        })

    })

}
module.exports.update = async function (req, res) {
    // if (req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    //         return res.redirect('back');
    //     })
    // } else {
    //     return res.status(401).send('Unauthorzied');
    // }
    if(req.user.id==req.params.id){
        try {
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("Multer eror",err);}

                    user.name=req.body.name;
                    user.email=req.body.email;

                if(req.file){
                    if(user.avatar){
                      fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    }
                    //this is saving the pathof the uploaded file in the avatar field in the user
                    user.avatar=User.avatarPath + '/' + req.file.filename;
                    
                }
                user.save();
               
                return res.redirect('back');
            })
            
        } catch (err) {
            req.flash('error',err);
        return res.redirect('back'); 
        }

    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorzied');
    }
}
//render the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_signup', {
        title: "Codeial | Sign Up"
    })
}
//render the sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_signin', {
        title: "Codeial | Sign In"
    })
}

//get the sign up data

module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { req.flash('error', err); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) {  req.flash('error', err);return }

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}



//get the sign in data

module.exports.createSession = function (req, res) {
        res.redirect('/');
        return;
}
module.exports.destroySession = function (req, res){
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success','Logged out Successfully');
        res.redirect('/');
    });
}