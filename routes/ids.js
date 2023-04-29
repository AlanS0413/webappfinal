const express = require('express')
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });



router.get('/create', async (req, res) => {
    res.render('createnew', { title: 'Create new contact', show_login: true});
});


router.post('/create', async (req, res) => {
    const prefix =  req.body.prefix.trim();
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
    const addressString = `${st} ${cit} ${stat}, ${z} ${ctry}`;

    try{
        const result = await geocoder.geocode(addressString);
        if (result.length > 0) {
            console.log(`The location of ${addressString} is ${result[0].latitude}/${result[0].longitude}`)
            const newcontact = await req.db.createContact(prefix, fname, lname, emailadd, phone, st, cit, stat, z, ctry, byphone, bymail, byemail, result[0].latitude, result[0].longitude);
        }
        else {
            throw new Error('Geocoder returned empty result');
        }
    }
    catch(error){
        console.log('Error geocoding address:', error.message);
    }
    res.redirect('/')
});

module.exports = router;