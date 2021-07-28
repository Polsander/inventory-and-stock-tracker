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
const cron = require('node-cron');

const passport = require('passport');
const LocalStrategy = require('passport-local');

//Error Exports
const ExpressError = require('./utilities/ExpressError');

//Models
const User = require('./models/user');
const Stock = require('./models/stock');

//Database connections 
const db_Url = process.env.DB_URL;

const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: db_Url,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.DB_SECRET
    }
});

// ^^ connect to link above for local dev - production will be db_Url
mongoose.connect(db_Url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    name: 'def',
    store, //--- Must enable this in production so we use the mongo session (in DEPLOYMENT).
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 15, //second -> minute -> 15 minutes
        maxAge: 1000 * 60 * 15
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
const mainTrackerRoute = require('./routes/mainTracker');
const cabinetRoutes = require('./routes/cabinets');
const unitRoutes = require('./routes/units');
const reigsterRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const resetRoutes = require('./routes/reset');
const adminRoutes = require('./routes/admin');
const inRoutes = require('./routes/in');
const outRoutes = require('./routes/out');
const reportRoutes = require('./routes/reports');
const landingPageRoute = require('./routes/landingPage')



app.use(mainTrackerRoute);
app.use('/cabinets', cabinetRoutes);
app.use('/units', unitRoutes);
app.use('/admin', adminRoutes)
app.use(reigsterRoutes);
app.use(loginRoutes);
app.use(logoutRoutes);
app.use(resetRoutes);
app.use(inRoutes);
app.use(outRoutes);
app.use(reportRoutes);
app.use(landingPageRoute);

//---scheduled node functions ---\\
//0 */12 * * *
cron.schedule('0 */12 * * *', async function () {
    console.log('triggered');
    const stocks = await Stock.find({});
    //logic for updating average
    for (let stock of stocks) {
        let { outData, totalMonthData, date } = stock

        if (date <= new Date()) {
            await Stock.findByIdAndUpdate(stock._id, {date: date.setMonth(date.getMonth() + 1)})
            if (outData.length === 0) { //add 0 to sum, push that into month total
                const newModel = await Stock.findByIdAndUpdate(stock._id, { $push: { totalMonthData: 0 } }, { new: true });

            } else { // sum all out data, push that into month total
                const summate = (accumulator, currentValue) => accumulator + currentValue;
                const sum = outData.reduce(summate);
                await Stock.findByIdAndUpdate(stock._id,
                    {
                        $push: { totalMonthData: parseInt(sum) },
                        outData: []
                    },
                    { new: true }
                );
            }
            //check if total totalMonthData.length >= 4, create an average of those numbers then remove index [0]
            const newModel = await Stock.findById(stock._id)
            if (newModel.totalMonthData.length > 3) {

                const summate = (accumulator, currentValue) => accumulator + currentValue;
                const avg = newModel.totalMonthData.reduce(summate) / newModel.totalMonthData.length
                const updatedMonthData = newModel.totalMonthData.splice(0, 1)
                const test = await Stock.findByIdAndUpdate(stock._id,
                    {
                        average: avg,
                        $set: { totalMonthData: newModel.totalMonthData }
                    },
                    { new: true }
                )

            }
        }
    }
});

//--------Error Handelling--------\\
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    if (!err.message) { err.message = 'Oh no! Something went wrong!' }
    if (err.satusCode > 599 || err.statusCode === undefined) { err.statusCode = 500 }
    if (res.status) {
        res.status(err.statusCode).render('error', { err })
    }
});


//port service
//special port for Heroku, for dev just use 3000
const port = process.env.PORT
//app.listen(3000, () => console.log('serving on port 3000'));

//when going into production, don't forget to comment in the appropriate link located in rest.js (controllers)