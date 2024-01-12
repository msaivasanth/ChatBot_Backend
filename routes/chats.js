const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Chat = require('../models/Chat')
const router = express.Router()

// Route 1: Fetch all the notes related to the unique user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        let note = await Chat.find({ user: req.user.id });
        res.send(note)
    } catch (error) {
        console.error(error.message)
        res.send(500).send("Internal server error")
    }
})

// Route 2: Add a new note
router.post('/addnote', fetchuser, [
    body('text').notEmpty().withMessage('User text is required'), // Adjust validation as needed
    body('botMsg').notEmpty().withMessage('Bot text is required'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { text, botMsg } = req.body;

        const note = new Chat({
            text:{user:text, bot: botMsg},
            user: req.user.id,
        });
        // console.log(note)

        const savedNote = await note.save();
        
        res.json(savedNote);
    } catch (error) {
        console.error(error.message)
        res.status(401).send("Internal Server Error")
    }

})

// Route 3: Updating the current note.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, sender } = req.body
        const newNote = {}
        if (title) newNote.title = title
        if (description) newNote.description = description
        if (tags) newNote.sender = sender

        let note = await Chat.findById(req.params.id)
        if (!note) { return res.status(401).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Chat.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.send({ note })

    } catch (error) {
        console.error(error.message)
        res.status(401).send("Internal Server Error")
    }
})

//Route 4: Delete an existing note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Chat.findById(req.params.id)
        if (!note) { return res.status(401).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Chat.findByIdAndDelete(req.params.id)
        res.json({ "Sucess": "The note is deleted", note: note })

    } catch (error) {
        console.error(error.message)
        res.status(401).send("Internal Server Error")
    }
})
module.exports = router