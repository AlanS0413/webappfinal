const express = require('express')
const router = express.Router();



const loggedin = (req, res, next) =>
{
    if(req.session.user){
        next();
    }
    else{
        res.status(401).send('<div style="text-align:center;"><h1>Oh I cant let just anyone get rid of my free data! Sign up first! </h1><p><a href="/signup"><button class="btn btn-outline-primary">Sign Up</button></a></p></div>');
    }
}

router.get('/:id/delete',loggedin, async (req, res) => {
    const contacts = await req.db.findContactById(req.params.id);
    res.render('deletecontact', { title: 'Delete Contact', show_login: true, contacts:[contacts]});

});


router.post('/:id/delete', loggedin, async (req, res) => {
    await req.db.deleteContact(req.params.id);
    res.redirect('/');
});

module.exports = router;