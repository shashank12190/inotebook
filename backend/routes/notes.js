const express = require('express')
const router = express.Router()
var fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');



//"Route:1"Get all the notes using GET:    "/api/notes/fetchallnotes"  loginlogin required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal srever error")
    }
})

//"Route:2"Add a new notes using POST:    "/api/notes/addnote"  login required

router.post('/addnote', fetchuser, [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", 'description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Notes({ title, description, tag, user: req.user.id })
        const savedNotes = await notes.save()
        res.json(savedNotes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal srever error")
    }
})


//"Route:3"Update an existing note PUT:    "/api/notes/updatenote/:id"  login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        const newNote = {};
        if ((title)) { newNote.title = title }
        if ((description)) { newNote.description = description }
        if ((tag)) { newNote.tag = tag }

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("not found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal srever error")
    }
})
//"Route:$"Delete an existing note DELETE:    "/api/notes/deletenote/:id"  login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("not found") }

        //allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted", note: note })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal srever error")
    }
})

module.exports = router