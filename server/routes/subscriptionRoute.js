const express = require('express')
const router = express.Router();
const Packages = require('../modules/Subscription/Packages')


router.get('/get-package/', async (req, res)=>{
   
    try {
        console.log("API Triggered")
        const Pkgs = new Packages()
        const packageValue = req.query.package;


        const packageDetails = await Pkgs.findPackage(packageValue)
        if (packageDetails) {
            console.log(packageDetails)
            res.status(200).json(packageDetails)
        } else {
            res.status(404).json({message: 'Package not found'})
        }

    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
})

module.exports = router;