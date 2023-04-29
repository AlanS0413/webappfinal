const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Database = require('./database.js');
const db = new Database('contact.db');
db.initialize();
const router = express.Router();



const app = express();
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
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

app.use(express.static('public'));
app.use(express.static('public/styles'));
app.use(bodyParser.json());

app.get('/data', async (req, res) => {
    const data = await req.db.findAllContacts();
    res.json(data);
});
app.use('/', require('./routes/startup'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/logout'));
app.use('/', require('./routes/ids'));
app.use('/', require('./routes/contactlists'));
app.use('/', require('./routes/editcontact'));
app.use('/', require('./routes/deletecontact'));



app.listen(8080, () => {

    console.log("Server is running on port 8080")
});


