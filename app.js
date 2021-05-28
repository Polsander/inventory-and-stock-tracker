if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

//Node Modules
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');

//Error Exports
const ExpressError = require('./utilities/ExpressError');

//User Model
const User = require('./models/user');


//Database connections 
const db_Url = process.env.DB_URL;

const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: db_Url,
    touchAfter: 24*60*60,
    crypto: {
        secret: process.env.DB_SECRET
    }
});

//'mongodb://localhost:27017/azco'
// ^^ connect to link above for local dev - production will be different link
mongoose.connect(db_Url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=> {
    console.log("Database connected");
});


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    store,
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Useful middleware that can be used as local vairable on any ejs template//

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.currentUser = req.user;
    next();
})



///---Using the Route Handlers---\\\
const homeRoute = require('./routes/home');
const cabinetRoutes = require('./routes/cabinets');
const unitRoutes = require('./routes/units');
const reigsterRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const resetRoutes = require('./routes/reset');
const adminRoutes = require('./routes/admin');
const incomingRoutes = require('./routes/incoming');
const outgoingRoutes = require('./routes/outgoing');



app.use(homeRoute);
app.use('/cabinets', cabinetRoutes);
app.use('/units', unitRoutes);
app.use('/admin', adminRoutes )
app.use(reigsterRoutes);
app.use(loginRoutes);
app.use(logoutRoutes);
app.use(resetRoutes);
app.use(incomingRoutes);
app.use(outgoingRoutes);


//--------Error Handelling--------\\
app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found',404))
});

app.use((err,req,res,next) => {
    if(!err.message) { err.message = 'Oh no! Something went wrong!'}
    if(err.satusCode > 599 || err.statusCode === undefined) {err.statusCode = 500}
    if (res.status){
    res.status(err.statusCode).render('error', {err})
    }
});


//port service
//special port for Heroku, for dev just use 3000
const port = process.ENV.PORT
app.listen(port, () => console.log('serving on heroku'));