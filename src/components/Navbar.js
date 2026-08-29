import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Navbar = () => {

    let location = useLocation();
    const navigate = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/login');
    }

    const isActive = (path) => {
        if (path === "/notes") return location.pathname === "/notes" || location.pathname === "/notesbytags" || location.pathname === "/addnote";
        if (path === "/profile") return location.pathname === "/profile" || location.pathname === "/";
        return location.pathname === path;
    };

    const navLinkStyle = (active) => ({
        color: active ? "#FFFFFF" : "#9CA3AF",
        fontSize: "14px",
        fontWeight: active ? 600 : 500,
        lineHeight: "20px",
        fontFamily: "'Inter', sans-serif",
        borderRadius: "10px",
        padding: "0 12px",
        height: "44px",
        backgroundColor: active ? "rgba(196, 154, 69, 0.12)" : "transparent",
        border: active ? "1px solid #C49A45" : "1px solid transparent",
        boxShadow: active ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "none",
        transition: "all 0.2s ease-in-out",
        width: "100%",
        textDecoration: "none",
        position: "relative",
    });

    const iconStyle = (active) => ({
        color: active ? "#C49A45" : "#6B7280",
        fontSize: "20px",
        width: "20px",
        height: "20px",
    });

    return (
        <> 
        {localStorage.getItem('token') && <aside className="navbar navbar-vertical navbar-expand-lg navbar-dark" style={{backgroundColor: "#1A1C1E", borderRight: "1px solid #2D3136", width: "240px", padding: "24px 16px", overflow: "hidden"}}>
            <div className="container-fluid d-flex flex-column h-100 p-0" style={{overflow: "hidden"}}>
                {/* Logo */}
                <div style={{height: "48px", marginBottom: "32px", paddingLeft: "12px"}} className="d-flex align-items-center">
                    <Link className="d-flex align-items-center" to="/" style={{textDecoration: "none", gap: "12px"}}>
                        <i className="las la-book-open" style={{color: "#C49A45", fontSize: "24px", width: "24px", height: "24px"}}></i>
                        <span style={{color: "#FFFFFF", fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, lineHeight: "28px"}}>iNotebook</span>
                    </Link>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse d-lg-flex flex-column justify-content-between flex-grow-1" id="navbarSupportedContent">
                    {/* Navigation */}
                    <ul className="navbar-nav w-100" style={{gap: "4px"}}>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" style={{...navLinkStyle(isActive("/profile")), gap: "12px"}} to="/profile">
                                {isActive("/profile") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-user-circle" style={iconStyle(isActive("/profile"))}></i>
                                <span>Profile</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" style={{...navLinkStyle(isActive("/ViewDiary")), gap: "12px"}} to="/ViewDiary">
                                {isActive("/ViewDiary") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-book" style={iconStyle(isActive("/ViewDiary"))}></i>
                                <span>Diary</span>
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle d-flex align-items-center w-100" style={{...navLinkStyle(isActive("/notes")), gap: "12px"}} data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="true" to="/notes">
                                {isActive("/notes") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-sticky-note" style={iconStyle(isActive("/notes"))}></i>
                                <span>Notes</span>
                            </Link>
                            <div className={`dropdown-menu ${isActive("/notes") ? 'show' : ''}`} style={{backgroundColor: "#2A2D32", border: "1px solid #2D3136", borderRadius: "8px", marginTop: "4px"}}>
                                <Link className="dropdown-item" style={{color: location.pathname === "/notes" ? "#FFFFFF" : "#9CA3AF", fontSize: "13px", padding: "8px 16px"}} to="/notes">
                                    Search By Date
                                </Link>
                                <Link className="dropdown-item" style={{color: location.pathname === "/notesbytags" ? "#FFFFFF" : "#9CA3AF", fontSize: "13px", padding: "8px 16px"}} to="/notesbytags">
                                    Search By Tags
                                </Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center w-100" style={{...navLinkStyle(isActive("/sharedNotes")), gap: "12px"}} to="/sharedNotes">
                                {isActive("/sharedNotes") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-share-alt" style={iconStyle(isActive("/sharedNotes"))}></i>
                                <span>Shared Notes</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center w-100" style={{...navLinkStyle(isActive("/todolist")), gap: "12px"}} to="/todolist">
                                {isActive("/todolist") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-tasks" style={iconStyle(isActive("/todolist"))}></i>
                                <span>TodoList</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Bottom Utility */}
                    <div style={{marginTop: "auto"}}>
                        <hr style={{borderColor: "#2D3136", margin: "16px 0"}} />
                        <button onClick={handleLogout} className="btn w-100 d-flex align-items-center justify-content-center" style={{backgroundColor: "transparent", color: "#9CA3AF", border: "1px solid #2D3136", borderRadius: "10px", fontSize: "14px", fontWeight: 500, padding: "10px", gap: "8px", transition: "all 0.2s ease"}}>
                            <i className="las la-sign-out-alt" style={{fontSize: "18px"}}></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </aside>}
        </>
    )
}

export default Navbar