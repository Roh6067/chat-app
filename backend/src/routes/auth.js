const express = require("express");

const router = express.Router();

router.get(('/signup'), (req, res)=> {
    res.send('signup  page')
})

router.get(('/login'), (req, res)=> {
    res.send('login  page')
})

router.get(('/logout'), (req, res)=> {
    res.send('logout  page')
})


module.exports = router;