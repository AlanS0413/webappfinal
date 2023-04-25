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


router.get('/:id/edit', loggedin, async (req, res) => {
    const contacts = await req.db.findContactById(req.params.id);
    res.render('editinfo', { title: 'Edit Contact', show_login: true, contacts:[contacts], loggedin});

});

router.post('/:id/edit', loggedin, async (req, res) => {
    const new_fname =  req.body.firstname.trim();
    const new_lname = req.body.lastname.trim();
    const new_phone = req.body.phonenumber.trim();
    const new_emailadd = req.body.email.trim();
    const new_st = req.body.street.trim();
    const new_cit = req.body.city.trim();
    const new_z = req.body.zip.trim();
    const new_stat = req.body.state.trim();
    const new_ctry = req.body.country.trim();
    const new_byphone = req.body.contact_by_phone !== undefined;
    const new_byemail = req.body.contact_by_email !== undefined;
    const new_bymail = req.body.contact_by_mail !== undefined;

    const updatedContact = await req.db.updateContactData(new_fname, new_lname, new_emailadd, new_phone, new_st, new_cit, new_stat, new_z, new_ctry, new_byphone, new_byemail, new_bymail, req.params.id);
    res.redirect('/');

});



module.exports = router;