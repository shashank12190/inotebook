// import react from 'react'
import NoteContext from './noteContext'
import React, { useState } from 'react'


const Notestate = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)
    //To get all notes
    const getNotes = async () => {
        //Api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
            });
        const json = await response.json()
        console.log(json);
        setNotes(json)
    }
    //To add a note
    const addNote = async (title, description, tag) => {
        //todo api calling
        const response = await fetch(`${host}/api/notes/addnote`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, tag })
            });
        const note = await response.json()
        setNotes(notes.concat(note))

    }
    //To delete a note
    const deleteNote = async (id) => {
        console.log('deleting note with id: ' + id);
        //Todo Api calling
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
            });
        const json = await response.json()
        console.log(json);

        const newNote = notes.filter((note) => {
            return (note._id !== id)
        })
        setNotes(newNote)

    }
    //To edit a note
    const editNote = async (id, title, description, tag) => {
        //API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description, tag })
            });
        const json = await response.json();
        console.log(json);

        let newNotes = JSON.parse(JSON.stringify(notes))
        //logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title
                newNotes[index].description = description
                newNotes[index].tag = tag
                break;
            }
        }
        setNotes(newNotes)
    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, getNotes, editNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default Notestate