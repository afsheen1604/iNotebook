import React, { useContext, useEffect, useRef, useState } from "react";

import Select from 'react-select';
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import { useNavigate } from "react-router-dom";
import AddNote from "./addNote";
import img from './timg3.jpg'


const TagNote = (props) => {
  const context = useContext(noteContext);
  const {allNotes, tags, allUsers, getAllUsers, editNote, deleteNote, getAllNotes, getTags } = context;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getTags();
      getAllNotes([]);
      getAllUsers();
    } else {
      navigate("/login");
    }
  }, []);

  const ref = useRef(null);
  const refC = useRef(null);
  const refD = useRef(null);
  const refCD = useRef(null);
  const refS = useRef(null);
  const refSC = useRef(null);


  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });
  const [deleteId, setDeleteId] = useState("");
  const [deleteTitle, setDeleteTitle] = useState("");

  const deleteNoteItem = (currentNote) => {
    setDeleteId(currentNote._id);
    setDeleteTitle(currentNote.title);
    refD.current.click();
  };

  const handleDeleteClick = (e) => {
    deleteNote(deleteId);
    setDeleteId("");
    refCD.current.click();
    props.showAlert("Note Deleted Successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleTagChange = (selected) => {
    setSelectedTags(selected);
  };

  const searchByTags = () => {
    const labelsArray = selectedTags.map(item => item.label);
    console.log(labelsArray);
    getAllNotes(labelsArray);
  }


  const shareNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
    setSelectedOptions(currentNote.shared);
    refS.current.click();
  }

  const shareToUsers = () =>{
    // const sharedUsers = selectedOptions.map(item => item.value);
    console.log(selectedOptions);
    editNote(note.id, note.etitle, note.edescription, note.etag, selectedOptions);
    refSC.current.click();
    props.showAlert("Note Shared Successfully", "success");
  }

  return (

    

    <div className="p-4" style={{backgroundImage: `url(${img})`, minHeight:"100vh"}}>
      <div className="row mb-5">
        <div className="col-7">
          {/* <button
              type="button"
              className="btn text-white me-2"
              style={{backgroundColor: "#5a1734"}}
              onClick={() => {
                navigate("/addnote");
              }}
            >
              Add Note
            </button> */}
            <button
              type="button"
              className="btn"
              onClick={() => {
                navigate("/");
              }}
            >
              Search By Date
            </button>
        </div>
          
        <div className="col-5 row">
            <div className="col-8">
              <Select
                options={tags}
                isMulti
                value={selectedTags}
                onChange={handleTagChange}
              />
            </div>

            <div className="col-4">
              <button
                type="button"
                className="btn text-white"
                style={{backgroundColor: "#5a1734"}}
                onClick={searchByTags}
              >
                Search
              </button>
            </div>
        </div>
        

      

      </div>
      

      
      
      

      <a
        ref={refD}
        class="btn d-none"
        data-bs-toggle="modal"
        data-bs-target="#modal-danger"
      >
        Danger modal
      </a>

      <div
        class="modal modal-blur fade"
        id="modal-danger"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <button
              type="button"
              ref={refCD}
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div class="modal-status bg-danger"></div>
            <div class="modal-body text-center py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon mb-2 text-danger icon-lg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 9v2m0 4v.01" />
                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
              </svg>
              <h3>Are you sure?</h3>
              <div class="text-muted">
                Do you really want to Delete Note{" "}
              </div>{" "}
              {deleteTitle} ?
            </div>
            <div class="modal-footer">
              <div class="w-100">
                <div class="row">
                  <div class="col">
                    <a ref={refCD} class="btn w-100" data-bs-dismiss="modal">
                      Cancel
                    </a>
                  </div>
                  <div class="col">
                    <a onClick={handleDeleteClick} class="btn btn-danger w-100">
                      Delete Note
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <a href="#" class="btn d-none" ref={refS} data-bs-toggle="modal" data-bs-target="#modal-report">
        Share Note
      </a>
      <div className="modal modal-blur fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal-report" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Share Note &nbsp;&nbsp; <span style={{color: "#5a1734"}}>"{note.etitle}"</span> </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Users</label>
                <Select
                  options={allUsers}
                  isMulti
                  value={selectedOptions}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button ref={refSC} className="btn btn-outline" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn text-white ms-auto" style={{backgroundColor: "#5a1734"}} onClick={shareToUsers}>
                share
              </button>
            </div>
          </div>
        </div>
      </div>

  

      <div className="container mx-2 notesContainer">
        <div className="row my-3">
          <h2>Your Notes</h2>
          {allNotes.length === 0 && "No notes to display"}
          {allNotes.map((note) => {
            return (
              <Noteitem
                key={note._id}
                shareNote={shareNote}
                deleteNoteItem={deleteNoteItem}
                note={note}
                showAlert={props.showAlert}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TagNote;
