const express = require('express');
const session = require('express-session');
const Database = require('./database.js');
const db = new Database('contact.db');
db.initialize();
const router = express.Router();



const app = express();
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log("Sending DB to request");
    req.db = db;
    next();
})

app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use((req, res, next)=>{
    if (req.session.user) {
        res.locals.user= {
            id: req.session.user.user_id,
            username: req.session.user.username
        }
    }
    next();
});


app.set('view engine', 'pug');

app.locals.pretty = true;


app.use('/', require('./routes/startup'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/logout'));
app.use('/', require('./routes/ids'));
app.use('/', require('./routes/contactlists'));
app.use('/', require('./routes/editcontact'));
app.use('/', require('./routes/deletecontact'));
app.use('/', require('./routes/places'));



app.listen(8080, () => {

    console.log("Server is running on port 8080")
});


