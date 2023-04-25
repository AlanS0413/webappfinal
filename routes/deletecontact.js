const express = require('express')
const router = express.Router();



const loggedin = (req, res, next) =>
{
    if(req.session.user){
        next();
    }
    else{
        res.status(401).send('Not authorized');
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