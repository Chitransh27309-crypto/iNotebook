import { useState } from 'react'
import NoteContext from './NoteContext'

const NoteState = (props) => {
    const host = process.env.REACT_APP_API_URL
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);


    // Get all the notes
    const getNotes = async () => {
        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json)
        setNotes(json);
    }

    // Add a note
    const addNote = async (title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        })
        const note = await response.json();
        setNotes(notes.concat(note));
    }
    // Delete a note
    const deleteNote = async (id) => {
        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json)
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
    }
    // edit a note
    const editNote = async (id, title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        })
        const json = await response.json();
        console.log(json)
        // Logic to edit in client side
        const newNotes = JSON.parse(JSON.stringify(notes))// JSON.parse for deep copy 
        for (let i = 0; i < newNotes.length; i++) {
            if (newNotes[i]._id === id) {// we cant change state directly in  react
                newNotes[i].title = title;
                newNotes[i].description = description;
                newNotes[i].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
        console.log(notes);
        console.log(typeof notes);
    }
    return (
        <NoteContext value={{ notes, setNotes, getNotes, addNote, deleteNote, editNote }} >{/*.provider has been removed*/}
            {props.children}
        </NoteContext>
    )
}
export default NoteState;