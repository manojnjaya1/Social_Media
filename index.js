const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port=8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session=require('express-session');
const passport=require("passport");
const passportLocal=require("./config/passport-local-strategy");
const passportJWT=require("./config/passport-jwt-strategy");
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');
const multer=require('multer');


app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//app.use(express.urlencoded); this is depricated
app.use(cookieParser());


app.use(express.static('./assets'));
//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);





//use express router

app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store session cookie in the db

app.use(
    session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    store:new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
    
    function(err){
        console.log(err ||'connect-mongodb setup ok');
    }
    
    ),
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
app.use('/',require("./routes"));
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server:${err}`);
    }
    console.log(`server is running on port: ${port}`);
})
