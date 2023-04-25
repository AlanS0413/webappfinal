const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });
const express = require('express')
const router = express.Router();

router.get('/places', async (req, res) => {
    const places = await req.db.findPlaces();
    const cords = await req.db.findCoordinates();
    res.json({ places: places, coordinates: cords});

});

router.put('/places', async (req, res) =>{
    try {
        const result = await geocoder.geocode(`${req.body.address}`);
        if (result.length > 0) {
            console.log(`The location of ${req.body.label} is ${result[0].latitude}/${result[0].longitude}`)
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

router.delete('/places/:id', async (req,res)=> {
    await req.db.deletePlaces(req.params.id);
    await req.db.deleteCoordinates(req.params.id);
    res.status(200).send();
});

module.exports = router;