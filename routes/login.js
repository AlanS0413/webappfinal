const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
    const firsname =  req.body.first.trim();
    const lasname = req.body.last.trim();
    const username = req.body.username.trim();
    const password = req.body.signuppassword.trim();
    const confirmpassword = req.body.confirmpassword.trim();

    if(password != confirmpassword){
        res.render('signup', {show_login: false, message: "Passwords Don't match"});
        return;
    }

    const user = await req.db.findUserByUserName(username);
    if (user) {

        res.render('signup', { show_login: true, message: 'This account already exists!' });
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = await req.db.createUser(firsname, lasname, username, hash);
    req.session.user = await req.db.findUserByUserName(username)
    res.redirect('/');

});

router.get('/login', async (req, res) => {
    res.render('login', { title: 'Login', show_login: false });
});

router.post('/login', async (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const user = await req.db.findUserByUserName(username);
    
    if(user && bcrypt.compareSync(password, user.password)){
        req.session.user = user;
        res.redirect('/');
        return;
    }
    else if(!user){
        res.render('login', {show_login: false, message: 'Could not find.'});
        return;
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up', show_login: false });
});

module.exports = router;