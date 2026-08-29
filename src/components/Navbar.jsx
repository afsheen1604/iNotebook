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
        {localStorage.getItem('token') && <aside style={{backgroundColor: "#1A1C1E", borderRight: "1px solid #2D3136", width: "240px", padding: "24px 16px", overflow: "hidden", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 1000, display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"}}>
                {/* Logo */}
                <div style={{height: "48px", marginBottom: "32px", paddingLeft: "12px"}} className="d-flex align-items-center">
                    <Link className="d-flex align-items-center" to="/" style={{textDecoration: "none", gap: "12px"}}>
                        <i className="las la-book-open" style={{color: "#C49A45", fontSize: "24px", width: "24px", height: "24px"}}></i>
                        <span style={{color: "#FFFFFF", fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, lineHeight: "28px"}}>iNotebook</span>
                    </Link>
                </div>

                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1}}>
                    {/* Navigation */}
                    <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px"}}>
                        <li >
                            <Link className="d-flex align-items-center" style={{...navLinkStyle(isActive("/profile")), gap: "12px"}} to="/profile">
                                {isActive("/profile") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-user-circle" style={iconStyle(isActive("/profile"))}></i>
                                <span>Profile</span>
                            </Link>
                        </li>
                        <li >
                            <Link className="d-flex align-items-center" style={{...navLinkStyle(isActive("/ViewDiary")), gap: "12px"}} to="/ViewDiary">
                                {isActive("/ViewDiary") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-book" style={iconStyle(isActive("/ViewDiary"))}></i>
                                <span>Diary</span>
                            </Link>
                        </li>
                        <li >
                            <Link className="d-flex align-items-center w-100" style={{...navLinkStyle(isActive("/notes")), gap: "12px"}} to="/notes">
                                {isActive("/notes") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-sticky-note" style={iconStyle(isActive("/notes"))}></i>
                                <span>Notes</span>
                            </Link>
                            {isActive("/notes") && <div style={{paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px"}}>
                                <Link style={{color: location.pathname === "/notes" ? "#FFFFFF" : "#9CA3AF", fontSize: "13px", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", backgroundColor: location.pathname === "/notes" ? "#2A2D32" : "transparent", display: "flex", alignItems: "center", gap: "8px"}} to="/notes">
                                    <i className="las la-circle" style={{fontSize: "6px"}}></i> Search By Date
                                </Link>
                                <Link style={{color: location.pathname === "/notesbytags" ? "#FFFFFF" : "#9CA3AF", fontSize: "13px", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", backgroundColor: location.pathname === "/notesbytags" ? "#2A2D32" : "transparent", display: "flex", alignItems: "center", gap: "8px"}} to="/notesbytags">
                                    <i className="las la-circle" style={{fontSize: "6px"}}></i> Search By Tags
                                </Link>
                            </div>}
                        </li>
                        <li >
                            <Link className="d-flex align-items-center w-100" style={{...navLinkStyle(isActive("/sharedNotes")), gap: "12px"}} to="/sharedNotes">
                                {isActive("/sharedNotes") && <div style={{position: "absolute", left: "-16px", width: "4px", height: "24px", backgroundColor: "#C49A45", borderRadius: "0 4px 4px 0"}}></div>}
                                <i className="las la-share-alt" style={iconStyle(isActive("/sharedNotes"))}></i>
                                <span>Shared Notes</span>
                            </Link>
                        </li>
                        <li >
                            <Link className="d-flex align-items-center w-100" style={{...navLinkStyle(isActive("/todolist")), gap: "12px"}} to="/todolist">
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