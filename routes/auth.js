const express = require('express')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = 'Sample@Secret123$'


// Route 1: Sign in
router.post('/createuser',[
    body('name', 'enter name with at least length of 5').isLength({ min: 5 }),
    body('email', 'enter valid email').isEmail(),
    body('password', 'length must be 5 or more').isLength({ min: 5 })
], async (req, res)=>{
    const result = validationResult(req);
    let success = false;
    if(!result.isEmpty()) {
        return res.status(400).json({error: result.array()})
    }

    try {
        // This also returns a promise, we bring the response from db based on entered email
        let user = await User.findOne({email: req.body.email})
    
        // Here we check whether the entered user email id is already present in db or not
        if(user) {
           return res.status(400).json({message: "Enter another email"})
        }
    
        // Here we add salt to the given password and generate hash which gives more security to our details.
        const salt = await bcrypt.genSalt(10)
        const secPassword = await bcrypt.hash(req.body.password, salt)
    
        // Here the data gets added into the data base, it returns a promise
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword
        })
    
        const data = {
            user: {
                id: user.id
            } 
        }
    
        // This token is generated for each user
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({success, authToken})
        
    } catch (error) {
        console.log(error.message) 
        res.status(500).json({error: "Internal Server error"})
    }
})

// Route 2: login
router.post('/login', [
    body('email', 'enter correct email').isEmail(),
    body('password', 'Enter correct password').exists()
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if(!result.isEmpty()) {
        return res.status(400).json({error: result.array()})
    }

    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "Enter correct email"})
        }
    
        const passwordcheck = await bcrypt.compare(password, user.password)
        if(!passwordcheck) {
            return res.status(400).json({message: "Enter correct password"})
        }
        // console.log("Completed")
        const data = {
            user: {
                id: user.id
            } 
        }
        
        success = true
        const authToken = jwt.sign(data, JWT_SECRET)
        res.send({success, authToken})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: "Internal Server error"})
    }
})

// Route 3: retriving user credentials
router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const data = await User.findById(userId).select('-password')
        res.send(data)    
    } catch (error) {
        // console.log(error)
        res.status(500).send("Internal server error")
    }
})
module.exports = router