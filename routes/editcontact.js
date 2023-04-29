const express = require('express')
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });


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
    console.log(contacts, "Edit get")
});

router.post('/:id/edit', loggedin, async (req, res) => {
    const new_prefix = req.body.prefix.trim();
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
    const addressString = `${new_st} ${new_cit} ${new_stat}, ${new_z} ${new_ctry}`;

    try{
        const result = await geocoder.geocode(addressString);
        if (result.length > 0) {
            console.log(`The location of ${addressString} is ${result[0].latitude}/${result[0].longitude}`)
            const updatedContact = await req.db.updateContactData(new_prefix, new_fname, new_lname, new_emailadd, new_phone, new_st, new_cit, new_z, new_stat, new_ctry, new_byphone, new_byemail, new_bymail, req.params.id, result[0].latitude, result[0].longitude);
        }
        else {
            throw new Error('Geocoder returned empty result');
        }
    }
    catch(error){
        console.log('Error geocoding address:', error.message);
    }
    res.redirect('/');

});



module.exports = router;