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
        <div className="col-md-3 mb-3">
            <div class="card card-link card-link-rotate" style={{"backgroundColor": "#e3afbc"}}>
                <div className="ribbon fs-5 px-3" style={{backgroundColor: "#9a1750", zIndex: "0"}}>{note.tag}</div>
                <div class="card-body">
                    <h3 class="card-title">
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
                    <div class="avatar-list avatar-list-stacked mb-3">
                        {note.image.length!==0 &&
                            note.image.map((img) => {
                                return <span class="avatar rounded" style={{backgroundImage: `url(${img})`}}></span>
                            })
                        }
                        {note.image.length==0 && "No Images Stored"}
                    </div>
                    <div class="card-meta d-flex justify-content-between">
                        <div >
                            <i class="las la-trash mx-2 fs-2" style={{color: "#4d4d4f"}} onClick={()=>{deleteNoteItem(note);}}></i>
                            <i class="las fs-2 mx-2 la-external-link-alt" style={{color: "#4d4d4f"}} onClick={()=>{shareNote(note);}}></i>
                            <Link to={`/Viewnote/${note._id}`}><i className="las fs-2 la-eye mx-2" style={{color: "#4d4d4f"}}></i></Link>
                        </div>
                        <span style={{fontSize: "0.95rem", color: "#4d4d4f"}}>{note.date}</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Noteitem
