const express = require('express')
const router = express.Router();

router.get('/', async (req, res) => {
    const contacts = await req.db.findAllContacts();
    res.render('homepage', { title: 'Homepage', show_login: true, contacts });
});

module.exports = router;