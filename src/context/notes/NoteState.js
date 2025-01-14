import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [noteItem, setNoteItem] = useState(null);
  const [todoList, setTodoList] = useState([]);
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [datesData, setDatesData] = useState([]);
  const [stats, setStats] = useState({});
  const [diary, setDiary] = useState(null);

  const updateDiary = async (description, image, date) =>{
    const response = await fetch(`${host}/api/notes/updateDiary`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({description, image, date })
    });

    const json = await response.json();
    setDiary(json)
  }

  const getDiary = async (date) => {
    const response = await fetch(`${host}/api/notes/fetchDiary`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ date })
    });
    const json = await response.json();
    setDiary(json);
  }

  const getStats = async (userid) => {
    const response = await fetch(`${host}/api/notes/getstats`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ userid })
    });
    const json = await response.json();
    setStats(json);
  }

  const getDatesData = async (month, year, userid) =>{
    const response = await fetch(`${host}/api/notes/datesData`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ month, year, userid })  
    });
    const json = await response.json();
    setDatesData(json);
  }

  const getTagsData = async (month, year, userid) =>{
    const response = await fetch(`${host}/api/notes/tagsData`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ month, year, userid })
    });
    const json = await response.json();
    setTagsData(json);
  }

  const getNotes = async (date) => {
    // API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ date }),
    });
    const json = await response.json();
    //console.log(json)
    setNotes(json);
  };

  const getTags = async () => {
    // API Call
    const response = await fetch(`${host}/api/notes/getTags`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      }
    });
    const json = await response.json();
    console.log(json)
    setTags(json);
  };

  const getAllNotes = async (tags) => {
    // API Call
    const response = await fetch(`${host}/api/notes/getAllNotes`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ tags }),
    });
    const json = await response.json();
    console.log(json)
    setAllNotes(json);
  };

  const getSharedNotes = async () => {
    // API Call
    const response = await fetch(`${host}/api/notes/fetchSharedNotes`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    // console.log(json)
    setSharedNotes(json);
  };

  const getNotebyId = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/fetchnote`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ id }),
    });
    const json = await response.json();
    setNoteItem(json);
  };


  const addNote = async (title, description, tag, image) => {
    // TODO: API Call
    // API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag, image }),
    });

    console.log("Adding a new note");
    const note = await response.json();

    setNotes(notes.concat(note));
  };

  const deleteNote = async (id) => {
    // TODO: API Call

    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    console.log("Deleting the note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  const editNote = async (id, title, description, tag, sharedUsers) => {
    // API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag, shared:sharedUsers }),
    });
    const json = response.json();

    // Logic to edit in client
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      if (newNotes[index]._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        newNotes[index].shared = sharedUsers;
        break;
      }
    }
    setNotes(newNotes);
  };

  //functions for Todolist

  const getTodoList = async () => {
    // API Call
    const response = await fetch(`${host}/api/todolist/fetchTodoList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json)
    setTodoList(json);
  };

  const addListItem = async (content) => {
    // TODO: API Call
    // API Call
    const response = await fetch(`${host}/api/todolist/addListItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({content}),
    });

    console.log("Adding a new List Item");
    const listItem = await response.json();
    setTodoList(todoList.concat(listItem));
  };

  const deleteListItem = async (id) => {
    // TODO: API Call

    const response = await fetch(`${host}/api/todolist/deleteListItem/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    console.log("Deleting the ListItem with id" + id);
    const newTodoList = todoList.filter((listItem) => {
      return listItem._id !== id;
    });
    setTodoList(newTodoList);
  };

  const editListItem = async (id, status, content) => {
    // API Call
    const response = await fetch(`${host}/api/todolist/updateListItem/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ status, content })
    });
    const json = response.json();

    // Logic to edit in client
    let newTodoList = JSON.parse(JSON.stringify(todoList));
    for (let index = 0; index < newTodoList.length; index++) {
      if (newTodoList[index]._id === id) {
        newTodoList[index].status = status;
        break;
      }
    }
    setTodoList(newTodoList);
  };

  const getUser = async (userid) => {
    // API Call
    const response = await fetch(`${host}/api/auth/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ userid })
    });
    const json = await response.json();
    //console.log(json)
    setUser(json);
  };

  const updateUser = async (name, mobile, password, hobbies, profileImage) => {
    // API Call
    const response = await fetch(`${host}/api/auth/updateUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, mobile, password, hobbies, profileImage })
    });
    const json = await response.json();
    //console.log(json)
    setUser(json);
  };

  const getAllUsers = async () => {
    // API Call
    const response = await fetch(`${host}/api/auth/getAllUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      }
    });
    const json = await response.json();
    // console.log(json)
    setAllUsers(json);
  };

  const suggestTasks = async () => {
    // API Call
    const response = await fetch(`${host}/api/todolist/suggestTasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      }
    });
    const json = await response.json();
    // console.log(json)
    if(json.success){
      getTodoList();
    }
  };
  
  


  return (
    <NoteContext.Provider
      value={{ notes, sharedNotes, allUsers, noteItem, todoList, user, tags, allNotes, tagsData, datesData, stats, diary, getDiary, updateDiary, getStats, getDatesData, getTagsData, getAllNotes, getTags, suggestTasks, getAllUsers, getUser, updateUser, addNote, deleteNote, editNote, getNotes, getSharedNotes, getNotebyId, getTodoList, addListItem, deleteListItem, editListItem }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
