const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Harryisagoodb$oy'



//"Route:1"Create a user using POST    "/api/auth/createuser"  No login required
router.post('/createuser',
    [
        body("name", "enter a valid name").isLength({ min: 3 }),
        body("email", 'enter a valid email').isEmail(),
        body("passward", 'passward must be at least 5 characters').isLength({ min: 5 })
    ],
    async (req, res) => {
        success = true
        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // check weather the user with this exists already
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ error: "Sorry a user with this email already exists" })
            }
            const salt = await bcrypt.genSalt(10)
            secPass = await bcrypt.hash(req.body.passward, salt)
            // to create a new user
            user = await User.create({
                name: req.body.name,
                passward: secPass,
                email: req.body.email
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);

            success = true
            res.json({ success, authtoken })
        } catch (error) {
            console.error(error.message)
            res.status(500).send("internal srever error")
        }
    })


//"Route:2"Authenticate a user using POST    "/api/auth/login"  No login required
router.post('/login',
    [
        body("email", 'enter a valid email').isEmail(),
        body("passward", 'passward cannot be blank').exists()
    ],
    async (req, res) => {
        success = false
        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, passward } = req.body
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "please try to login with correct credentials" })
            }
            const passwardCompare = await bcrypt.compare(passward, user.passward)
            if (!passwardCompare) {
                return res.status(400).json({ error: "please try to login with correct credentials" })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true
            res.json({ success, authtoken })

        } catch (error) {
            console.error(error.message)
            res.status(500).send("Internal server error")
        }

    })
//"Route:3" get loggedin user details  POST    "/api/auth/getuser"  login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userID = req.user.id
        const user = await User.findById(userID).select("-passward")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})
module.exports = router

