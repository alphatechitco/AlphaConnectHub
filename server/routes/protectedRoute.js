const express = require('express');
const { verifyTokenMiddleware} = require('../modules/Tokens/tokenWork');
const router  = express.Router();


router.get('/protected-route', verifyTokenMiddleware , (req , res) => {
    res.status(200).json({success:true, user_id:req.user})
})

module.exports = router;