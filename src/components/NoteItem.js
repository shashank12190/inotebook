import React, { useContext } from 'react'
import noteContext from '../context/noteContext'

const NoteItem = (porps) => {
    const context = useContext(noteContext)
    const { deleteNote } = context
    const { note, updateNote, showAlert } = porps
    const onClickHandle = () => {
        deleteNote(note._id)
        showAlert(':- Note Deleted Successfully', 'success')
    }
    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="far fa-trash-alt mx-2" onClick={onClickHandle}></i>
                        <i className="fas fa-edit mx-2" onClick={() => { updateNote(note) }}></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>

        </div>
    )
}

export default NoteItem
