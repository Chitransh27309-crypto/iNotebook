import React, { useContext } from 'react'
import noteContext from '../Context/notes/NoteContext'
const NoteItem = (props) => {
    const { deleteNote } = useContext(noteContext);
    const { note, updateNote } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-2">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text"> {note.description}</p>
                    <i className="fa-regular fa-trash-can mx-2" onClick={() => { deleteNote(note._id); props.showAlert("Deleted Successfully", "success"); }}></i>
                    <i className="fa-regular fa-pen-to-square mx-2" onClick={() => { updateNote(note) }}></i>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
