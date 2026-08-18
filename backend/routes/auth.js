const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET =  process.env.JWT_SECRET

//ROUTE:1 Create a User using : POST "/api/auth/createuser". No login required

router.post('/createuser', [
    body('email', 'enter a valid email').isEmail(),
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('password', 'password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    // if there are errors, return Bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {
        // check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email alredy exists" })
        }
        // we don't store password directly into db instead we convert into hash
        const salt = await bcrypt.genSalt(10);
        secPaas = await bcrypt.hash(req.body.password, salt);   // await because it returns a promise

        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPaas,
            email: req.body.email
        })
        // using json webtoken 
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})

//ROUTE:2 Authenticate a User using : POST "/api/auth/login". No login required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res) => {
    let success = false;
    // if there are errors, return Bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // checking the user enters a correct email or not 
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errror: "Please try to login with correct credentials" })
        }
        // checking the user enters a correct password or not 
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({success, errror: "Please try to login with correct credentials" })
        }
        // if everything is right then give him a authtoken
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = await jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE:3 Get loggedin Details using: Post "/api/auth/getuser" Login required

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password");
        res.send({ user: user })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router