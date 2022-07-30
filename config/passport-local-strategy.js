const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User=require("../models/user");
passport.use(new LocalStrategy({
    usernameField:'email'
},
//find user and establish identity
function(email,password,done){
User.findOne({email:email},function(err,user){
    if(err){
        console.log("Error in finding user--> passport");
        return done(err);
    }
    if(!user || user.password!=password)
    {
        console.log("invaid username /password");
        return done(null,false);
    }
    return done(null,user);
});
}
));

//serialising the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
 done(null,user.id);
});
// deserialising the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("Error in finding user--> passport");
        return done(err);
        }
        return done(null,user);
    });

});
//check if the uer is Authenticated

passport.checkAuthentication=function(req,res,next){
    //if user is signed in passon the request to the next funtion
    if(req.isAuthenticated()){
        return next()
    }
    //ifthe user is not signed in
    return res.redirect('/users/sign-in');

}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains current signed in user from the cookie
        res.locals.user=req.user;
           
    }
    next();
}


module.exports=passport;