import React, {useContext} from "react";
import noteContext from "../context/notes/noteContext";

import img from  "./bg3.jpg"
import { Link, Navigate } from "react-router-dom";

const Noteitem = (props) => {
    const context  = useContext(noteContext);
    const {deleteNote} = context;
    const { note, shareNote, deleteNoteItem } = props; 
    return (
        <>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="card card-link card-link-rotate" style={{"backgroundColor": "#F3EEE3"}}>
                <div className="ribbon fs-5 px-3" style={{backgroundColor: "#C49A45", zIndex: "0"}}>{note.tag}</div>
                <div className="card-body">
                    <h3 className="card-title">
                        {note.title}
                    </h3>
                    {/* <div className="fs-5">
                        <p>Summary :</p>
                        <ul>

                            <li>Images Uploaded : {note.image.length}</li>
                            <li>Videos Uploaded : 0</li>
                            <li>Content Writtem : 500 words</li>
                        </ul>
                    </div> */}
                    <div className="avatar-list avatar-list-stacked mb-3">
                        {note.image.length!==0 &&
                            note.image.map((img, index) => {
                                return <span key={index} className="avatar rounded" style={{backgroundImage: `url(${img})`}}></span>
                            })
                        }
                        {note.image.length===0 && "No Images Stored"}
                    </div>
                    <div className="card-meta d-flex justify-content-between">
                        <div >
                            <i className="las la-trash mx-2 fs-2" style={{color: "#6B7280"}} onClick={()=>{deleteNoteItem(note);}}></i>
                            <i className="las fs-2 mx-2 la-external-link-alt" style={{color: "#6B7280"}} onClick={()=>{shareNote(note);}}></i>
                            <Link to={`/Viewnote/${note._id}`}><i className="las fs-2 la-eye mx-2" style={{color: "#6B7280"}}></i></Link>
                        </div>
                        <span style={{fontSize: "0.95rem", color: "#6B7280"}}>{note.date}</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Noteitem
