const express = require('express')
const router = express.Router();


router.get('/:id', async (req, res) => {
    const contact = await req.db.findContactById(req.params.id);
    console.log(contact);
    if (!contact) {
      res.status(404).send("Contact not found");
      return;
    }
    res.render('contactinfo', { contact: contact, title: "Contact List", show_login: true });
});




module.exports = router;