import React, { useContext, useEffect, useRef, useState } from "react";

import Select from 'react-select';
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import { Link, useNavigate } from "react-router-dom";
import AddNote from "./addNote";
import {DayPicker} from 'react-day-picker';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import 'react-day-picker/dist/style.css'; // import the CSS file from the correct path

const Notes = (props) => {
  const context = useContext(noteContext);
  const { token, allUsers, notes, getNotes, editNote, deleteNote, getAllUsers } = context;
  const { addNote } = context;
  const navigate = useNavigate();

  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  const [postImage, setPostImage] = useState([]);

   useEffect(() => {
    console.log(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      console.log(token);

      const currentDate = new Date();

      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();

      const date = `${day}/${month}/${year}`;
      console.log(date);

      getNotes(date);
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
  const refAN = useRef(null);
  const refANC = useRef(null);


  // const [note, setNote] = useState({
  //   id: "",
  //   etitle: "",
  //   edescription: "",
  //   etag: "",
  // });
  const [deleteId, setDeleteId] = useState("");
  const [deleteTitle, setDeleteTitle] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    getNotes(date.toLocaleDateString('en-GB'));
  };

  const descriptionChange = (e) => {
    setNote({ ...note, description: e});
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    
    setPostImage([...postImage, base64]);
  };

  const removeImage = (index) => {
    setPostImage(prevState => prevState.filter((_, i) => i !== index));
  };

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
    ref.current.click();
  };

  const deleteNoteItem = (currentNote) => {
    setDeleteId(currentNote._id);
    setDeleteTitle(currentNote.title);
    refD.current.click();
  };

  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  const handleClick = (e) => {
    e.preventDefault();
    // console.log(postImage);
    if(note.tag.toUpperCase()=="DIARY"){
      showAlert("Tag should not be DIARY", "danger"); return;
    }

    addNote(note.title, note.description, note.tag, postImage);
    refANC.current.click();
    setNote({ title: "", description: "", tag: " " });
    setPostImage([]);
    props.showAlert("Note Added Successfully", "success");
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

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };


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

  const capitalize = (word)=>{
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  return (
    <div className="p-4" style={{backgroundColor: '#F8F6F0', minHeight: "100vh"}}>
      <button
        data-bs-toggle="modal"
        data-bs-target="#AddNote"
        type="button"
        className="btn"
        style={{backgroundColor: "#1A1C1E" ,color: "#fff",}}
      >
        Add Note
      </button>

      <Link className="btn mx-2" style={{color: "#1A1C1E !important"}} to="/notesbytags">Search By Tags</Link>
            
      <button
        ref={ref}
        type="button"
        className="btn d-none"
        style={{color: "#1A1C1E !important"}}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
                    aria-describedby="emailHelp"
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refC}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={handleClick}
                
                type="button"
                className="btn"
                style={{color: "#1A1C1E !important"}}
              >
                Update Note
              </button>
            </div>
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

      
      <div
        class="modal modal-blur fade"
        id="AddNote"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{color:"#1A1C1E"}}>Add a Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div style={{maxHeight: '50px'}} className='w-auto ms-auto mt-2'>
              {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                <strong>{capitalize(alert.type)}</strong>: {alert.msg} 
              </div>}
            </div>
            <div class="modal-body py-4 row">
                  <div className="mb-3 col-6">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" placeholder="Give a title!" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={onChange}/>
                  </div>
                  <div className="mb-3 col-6">
                    <label  className="form-label"> Tag
                      {/* <span><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-tag" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="8.5" cy="8.5" r="1" fill="currentColor"></circle><path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z"></path></svg></span><span>Tag</span>*/} </label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} aria-describedby="emailHelp" onChange={onChange}/>
                  </div>
                  <div className="mb-3">
                  <label className="form-label"> Description</label>
                    <ReactQuill  id="description" name="description" value={note.description} onChange={descriptionChange} />
                    
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Upload Images
                    {/* <span><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-upload" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M12 11v6"></path><path d="M9.5 13.5l2.5 -2.5l2.5 2.5"></path></svg></span>
                    */}</label> 
                    <input type="file" label="Image" name="myFile" id="image-upload" accept=".jpeg, .png, .jpg" className="form-control" onChange={(e) => handleImageUpload(e)} />
                  </div>
                  

                  {postImage.length!==0&&<div className="mb-3">
                    <label className="form-label">Uploaded Images</label>
                    <div className="row">
                    {postImage.map((img, index) => (
                          <div className="col-3" key={index}>
                              <div className="btn text-white py-1 px-2" style={{backgroundColor: "#1A1C1E"}} onClick={() => removeImage(index)}><i class="las la-backspace fs-2"></i></div>
                              <img src={img} alt="Stored Image" style={{ width: "150px" }} />
                          </div>
                      ))}
                    </div></div>}
                  
              
              
            </div>
            <div class="modal-footer">
              <button ref={refANC} className="btn btn-outline" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn ms-auto text-white" disabled={note.title.length < 5 || note.description.length < 5} style={{backgroundColor: "#1A1C1E"}} onClick={handleClick}>
                Add Note
              </button>
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
              <h5 className="modal-title">Share Note &nbsp;&nbsp; <span style={{color: "#1A1C1E"}}>"{note.etitle}"</span> </h5>
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
              <button className="btn ms-auto text-white" style={{backgroundColor: "#1A1C1E"}} onClick={shareToUsers}>
                share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className='card'>
                <div className='card-body'> */}
      <div className="card my-3" style={{width: "fit-content", backgroundColor: "#F8F6F0"}}>
        <DayPicker selected={selectedDate} onDayClick={handleDateChange} />
        {/* {selectedDate && <p>Selected date: {selectedDate.toLocaleDateString('en-GB')}</p>} */}
      </div>

      <div className="container mx-2 notesContainer">
        <div className="row my-3">
          <h2>Your Notes</h2>
          {notes.length === 0 && "No notes to display"}
          {notes.map((note) => {
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
      {/* </div>
            </div> */}
    </div>
  );
};

export default Notes;


function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

