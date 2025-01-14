import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import {Home} from './components/Home';
import NoteState from './context/notes/NoteState';
import About from './components/About';
import './App.css';
import Signup from './components/signUp';
import Login from './components/login';
import Alert from "./components/alert";
import TodoList from "./components/todolist";
import AddNote from "./components/addNote";
import Profile from "./components/Profile";
import Viewnote from "./components/Viewnote";
import SharedNotes from "./components/SharedNotes";
import TagNote from "./components/TagNote";
import '@fortawesome/fontawesome-free/css/all.css';
import img from './components/timg3.jpg'
import ViewUser from "./components/ViewUser";
import ViewDiary from "./components/ViewDiary";


function App() {

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

  const [imageUrl, setImageUrl] = useState("")
  
 
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <div class="page-wrapper" style={{backgroundColor: '#e3e2df'}}>
            <div class="page-body m-0">
              <div class="container-xl p-0">
                <Alert alert={alert}/>
                <Routes>
                  <Route exact path="/" element={<Home showAlert={showAlert} />} />
                  <Route exact path="/ViewDiary" element={<ViewDiary showAlert={showAlert} />} />
                  <Route exact path="/sharedNotes" element={<SharedNotes showAlert={showAlert} />} />
                  <Route exact path="/login" element={<Login showAlert={showAlert} />} />
                  <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
                  <Route exact path="/todolist" element={<TodoList showAlert={showAlert} />} />
                  <Route exact path="/addNote" element={<AddNote showAlert={showAlert} setImageUrl={setImageUrl} />} />
                  <Route exact path="/profile" element={<Profile showAlert={showAlert} />} />
                  <Route exact path="/Viewnote/:noteid" element={<Viewnote showAlert={showAlert} />} />
                  <Route exact path="/ViewUser/:userid" element={<ViewUser showAlert={showAlert} />} />
                  <Route exact path="/notesbytags" element={<TagNote showAlert={showAlert} />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
