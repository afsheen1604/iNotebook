import React, {useContext, useEffect, useState} from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";


const TodoList = (props) => {
    const context  = useContext(noteContext);
    const {todoList, getTodoList, addListItem, deleteListItem, editListItem, suggestTasks} = context;
    const [listItem, setListItem] = useState("");
    const navigate = useNavigate();
    const [listShow, setListShow] = useState("all");

    useEffect(() => {

        if (localStorage.getItem('token')) {
            getTodoList();
        }
        else {
            navigate('/login');
        } 
    }, []);

    const onChange = (e) => {
        setListItem(e.target.value);
    }

    const handleClick = (e) => {
        e.preventDefault();
        addListItem(listItem);
        setListItem(""); getTodoList();
        props.showAlert("List Item Added Successfully", "success");
    }

    const suggestTasksFunc = () =>{
      suggestTasks();
      props.showAlert("Tasks suggested based on your intrests", "success");
    }

    const handleEditItem = (id, status, content) =>{
      editListItem(id, status, content);
    }

    const toggleClick = (e)=>{
      setListShow(e.target.id);
    }

    return (
        <div className="p-4" style={{backgroundColor: '#F8F6F0', minHeight: "100vh"}}>
          
          <div className="card mb-3 m-auto todolist-card">
            <div className="card-header row justify-content-between align-items-center g-2">
              <div className="col-12 mb-2 fs-2" style={{color:"#1A1C1E"}}><h1>Todo List</h1></div>
              <div className="col-6 col-md-3"><p className="fs-3 mb-0">{todoList.length} Tasks</p></div>
              <div className="col-12 col-md-7 task-filters d-flex flex-wrap gap-2">
                <button className={`btn toggle-buttons ${listShow === "all" ? 'activetoggle': ''} `} id="all" onClick={toggleClick}>All</button>
                <button className={`btn toggle-buttons ${listShow === "pending" ? 'activetoggle': ''} `} id="pending" onClick={toggleClick}>Active</button>
                <button className={`btn toggle-buttons ${listShow === "completed" ? 'activetoggle': ''} `} id="completed" onClick={toggleClick}>Completed</button>
              </div>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush list-group-hoverable">
                {todoList.filter((item) => (listShow==='all' || item.status === listShow)).map((item) => {
                  return(
                    <div className="list-group-item" key={item._id} style={{backgroundColor:(item.status === 'completed' ? 'rgba(110,139,116,0.15)' : '#C49A452e')}}>
                      <div className="row align-items-center g-2">
                        <div className="col-2 col-md-1">
                          <input type="checkbox" className={`form-check-input ${item.status === 'completed' ? 'd-none' : ''}`} style={{backgroundColor:"#F8F6F0"}} onChange={(e)=>{if(e.target.checked){handleEditItem(item._id, "completed", item.content);} else{
                            handleEditItem(item._id, "pending", item.content);
                          }}}/>
                        </div>
                        <div className="col-8 col-md-10">
                          <div className={`d-block text-muted mt-n1 ${item.status === 'completed' ? 'text-decoration-line-through' : ''}`} id={item._id + "Text"}>
                          <p className="mb-0 fs-3 gap-2 d-flex">
                            {item.type === "suggested" ? <i className="las la-hand-pointer fs-2"></i> : null}
                            {item.content}
                          </p>
                          </div>
                        </div>
                        <div className="col-2 col-md-1 text-truncate text-end" >
                          <i className="las la-trash-alt mx-2 fs-2" style={{color: '#1A1C1E'}} onClick={()=>{deleteListItem(item._id); props.showAlert("Note Deleted Successfully", "success");}}></i>
                        </div>
                      </div>
                    </div>);
                })}
              </div>
              <br />

            
            <div className="row align-items-end g-2">
             <div className="col-12 col-md-3"><button className="btn text-white w-100" style={{backgroundColor:"#1A1C1E"}} onClick={suggestTasksFunc}>Suggest Tasks</button></div>
              
                <div className="col-9 col-md-7">
                  <input type="text" value={listItem} onChange={onChange} className="form-control" />
                </div>
                <div className="col-3 col-md-2">
                  <button className="btn btn-primary w-100" style={{backgroundColor:"#1A1C1E"}}onClick={handleClick}> <i className="las la-plus-circle fs-1"></i> </button>
                </div>
            </div>
         
              
            </div>
          </div>
          
        </div>
      );
      
}

export default TodoList