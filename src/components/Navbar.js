import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import img from './login-wm.png';


const Navbar = () => {

    let location = useLocation();
    const navigate = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <> 
        {localStorage.getItem('token') && <aside className="navbar navbar-vertical navbar-expand-lg navbar-dark" style={{backgroundColor: "#5a1734"}}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"> <img src={img} style={{width: "9rem"}} /></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse mt-3" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item fs-3 mb-1">
                            <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="las la-user-circle fs-2"></i>    
                                </span> 
                                <span className="nav-link-title">
                                    Profile
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item fs-3 mb-1">
                            <Link className={`nav-link ${location.pathname === "/ViewDiary" ? "active" : ""}`} to="/ViewDiary">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="las la-book"></i>    
                                </span> 
                                <span className="nav-link-title">
                                    Diary
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item dropdown fs-3 mb-1">

                            
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""} dropdown-toggle d-flex w-100`} data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="true" to="/">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="las la-clipboard fs-2"></i>    
                                </span> 
                                <span className="nav-link-title">
                                    Notes
                                </span>
                            </Link>

                            <div class={`dropdown-menu ${(location.pathname === '/' || location.pathname === '/notesbytags' || location.pathname === '/addnote' ) ? 'show' : '' }` }>
                                
                                <Link class="dropdown-item " to="/">
                                    Search By Date
                                </Link>
                                <Link class="dropdown-item " to="/notesbytags">
                                    Search By Tags
                                </Link>
                            </div>
                            

                        </li>
                        <li className="nav-item fs-3 mb-1">
                            <Link className={`nav-link ${location.pathname === "/sharedNotes" ? "active" : ""} d-flex w-100`} to="/sharedNotes">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="lab la-creative-commons-share fs-2"></i>    
                                </span> 
                                <span className="nav-link-title">
                                    Shared Notes
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item fs-3">
                            <Link className={`nav-link ${location.pathname === "/todolist" ? "active" : ""} d-flex w-100`} to="/todolist">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="las la-clipboard fs-2"></i>    
                                </span> 
                                <span className="nav-link-title">
                                    TodoList
                                </span>
                            </Link>
                        </li>
                    </ul>
                    <button onClick={handleLogout} className="btn btn-primary w-75 m-auto mb-3" style={{backgroundColor: "#7b415a"}}>Logout</button>
                </div>
            </div>
        </aside>}
        </>
    )
}

export default Navbar