import React, { useContext, useEffect, useRef, useState } from "react";

import Select from 'react-select';
import noteContext from "../context/notes/noteContext";
import SharedNoteItem from "./SharedNoteItem";
import { useNavigate } from "react-router-dom";
import AddNote from "./addNote";
import {DayPicker} from 'react-day-picker';

import img from './timg3.jpg'
import 'react-day-picker/dist/style.css'; // import the CSS file from the correct path

const SharedNotes = (props) => {
  const context = useContext(noteContext);
  const {sharedNotes, getSharedNotes} = context;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      getSharedNotes();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>

      <div className='p-4' style={{backgroundImage: `url(${img})`, minHeight: "100vh"}}>
        <div className="row my-3">
          <h2>Shared Notes</h2>
          {sharedNotes.length === 0 && "No notes to display"}
          {sharedNotes.map((note) => {
            return (
              <SharedNoteItem
                key={note._id}
                note={note}
                showAlert={props.showAlert}
              />
            );
          })}
        </div>
      </div>
      
    </>
  );
};

export default SharedNotes;
