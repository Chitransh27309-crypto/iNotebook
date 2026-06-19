const express = require('express')
const router = express.Router();
const Note = require('../models/Note');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const { route } = require('./auth');

//ROUTE:1 Get all the notes using : GET "/api/notes/fetchallnotes".Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})

//ROUTE:2 Add a new note using : POST "/api/notes/addnote".Login required
router.post('/addnote', [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], fetchuser, async (req, res) => {
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag, date } = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})

//ROUTE:3 Update an existing note using: PUT "/api/notes/updatenote".Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // Create a new note object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        // Find the note to be updated
        let note = await Note.findById(req.params.id)
        // checking yhe note exist or not
        if (!note) { return res.status(404).send("Not Found") };
        // Allow updation if user owns this
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        // updation
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { returnDocument: 'after' })
        res.json(note);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})

//ROUTE:4 Delete an existing note using: DELETE "/api/notes/updatenote".Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id)
        // checking the note exist or not
        if (!note) { return res.status(404).send("Not Found") };
        // Allow deletions if user owns this
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        // deletion
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "note has been deleted", note: note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router;