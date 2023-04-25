const express = require('express')
const router = express.Router();

router.get('/create', (req, res) => {
    res.render('createnew', { title: 'Create new contact', show_login: true });
});

router.post('/create', async (req, res) => {
    const fname =  req.body.firstname.trim();
    const lname = req.body.lastname.trim();
    const phone = req.body.phonenumber.trim();
    const emailadd = req.body.email.trim();
    const st = req.body.street.trim();
    const cit = req.body.city.trim();
    const z = req.body.zip.trim();
    const stat = req.body.state.trim();
    const ctry = req.body.country.trim();
    const byphone = req.body.contact_by_phone !== undefined;
    const byemail = req.body.contact_by_email !== undefined;
    const bymail = req.body.contact_by_mail !== undefined;

    const newcontact = await req.db.createContact(fname, lname, emailadd, phone, st, cit, stat, z, ctry, byphone, bymail, byemail);
    res.redirect('/');

});


module.exports = router;