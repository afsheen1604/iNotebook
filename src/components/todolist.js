import React, {useContext, useEffect, useState} from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";
import img from './timg3.jpg'

const TodoList = (props) => {
    const context  = useContext(noteContext);
    const {todoList, getTodoList, addListItem, deleteListItem, editListItem, suggestTasks} = context;
    const [listItem, setListItem] = useState("");
    const navigate = useNavigate();
    const [listShow, setListShow] = useState("all");

    useEffect(() => {

        console.log(localStorage.getItem('token'));
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
        <div className="p-4" style={{backgroundImage: `url(${img})`, minHeight: "100vh"}}>
          
          <div className="card mb-3 m-auto"style={{width: "70%"}}>
            <div className="card-header row justify-content-between align-items-center">
              <div className="col-12 mb-2 fs-2" style={{color:"#5a1734"}}><h1>Todo List</h1></div>
              <div className="col-2"><p className="fs-3">{todoList.length} Tasks</p></div>
              <div className="col-5 task-filters">
                <button className={`btn toggle-buttons ${listShow == "all" ? 'activetoggle': ''} `} id="all" onClick={toggleClick}>All</button>
                <button className={`btn toggle-buttons ${listShow == "pending" ? 'activetoggle': ''} `} id="pending" onClick={toggleClick}>Active</button>
                <button className={`btn toggle-buttons ${listShow == "completed" ? 'activetoggle': ''} `} id="completed" onClick={toggleClick}>Completed</button>
              </div>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush list-group-hoverable">
                {todoList.filter((item) => (listShow=='all' || item.status == listShow)).map((item) => {
                  return(
                    <div className="list-group-item" key={item._id} style={{backgroundColor:(item.status === 'completed' ? '#27b62747' : '#9a17502e')}}>
                      <div className="row align-items-center">
                        <div className="col-1">
                          <input type="checkbox" className={`form-check-input ${item.status === 'completed' ? 'd-none' : ''}`} stylee={{backgroundColor:"#e3e2df"}} onChange={(e)=>{if(e.target.checked){handleEditItem(item._id, "completed", item.content);} else{
                            handleEditItem(item._id, "pending", item.content);
                          }}}/>
                        </div>
                        <div className="col-10">
                          <div className={`d-block text-muted mt-n1 ${item.status === 'completed' ? 'text-decoration-line-through' : ''}`} id={item._id + "Text"}>
                          <p className="mb-0 fs-3 gap-2 d-flex">
                            {item.type === "suggested" ? <i className="las la-hand-pointer fs-2"></i> : null}
                            {item.content}
                          </p>
                          </div>
                        </div>
                        <div className="col-1 text-truncate" >
                          <i className="las la-trash-alt mx-2 fs-2" style={{color: '#5a1734'}} onClick={()=>{deleteListItem(item._id); props.showAlert("Note Deleted Successfully", "success");}}></i>
                        </div>
                      </div>
                    </div>);
                })}
              </div>
              <br />

            
            <div className="row align-items-end">
             <div className="col-2"><button class="btn text-white" style={{backgroundColor:"#5a1734"}} onClick={suggestTasksFunc}>Suggest Tasks</button></div>
              
                <div className="col-8">
                  <input type="text" value={listItem} onChange={onChange} className="form-control" />
                </div>
                <div className="col-2">
                  <button className="btn btn-primary mt-2" style={{backgroundColor:"#5a1734"}}onClick={handleClick}> <i class="las la-plus-circle fs-1"></i> </button>
                </div>
            </div>
         
              
            </div>
          </div>
          
        </div>
      );
      
}

export default TodoList