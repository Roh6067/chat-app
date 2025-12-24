const express = require('express');

const router = express.Router();

router.get(('/send'), (req,res) => {
    res.send('sender page shown');
})
router.get(('/recieve'), (req,res) => {
    res.send("reciever page shown");
})

module.exports = router