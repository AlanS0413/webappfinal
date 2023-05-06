const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });
const express = require('express')
const router = express.Router();




router.put('/contactsearch', async (req, res) =>{
    try {
        const result = await geocoder.geocode(`${req.body.addressInput}`);
        console.log(result, "Result")
        if (result.length > 0) {
            console.log(`The location of the search input is ${result[0].latitude}/${result[0].longitude}`)
            const id = await req.db.createPlaces(req.body.label, req.body.address)
            const coords = await req.db.createCoordinates(result[0].latitude, result[0].longitude)
            res.json({
                id: id,
                label: req.body.label,
                address: req.body.address,
                coords: coords
            });
        } else {
            res.status(400).json({ error: "Could not find location" });
            throw new Error('Geocoder returned empty result');
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
        console.log('Error geocoding address:', error.message);
        const id = await req.db.createPlaces(req.body.label, req.body.address)
        res.json({
            id: id,
            label: req.body.label,
            address: req.body.address,
            coords: null
        });
    }
});
























module.exports = router;