import React, { useContext, useEffect, useRef, useState } from "react";
import Select from 'react-select';
import noteContext from "../context/notes/noteContext"
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell, BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer } from "recharts";


function Profile( props ) {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  
  const { user, getUser, updateUser, getTagsData, tagsData, datesData, getDatesData, stats, getStats } = context;
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    mobile: '',
    hobbies: '',
    password: '',
    cnfPassword: '',
    profileImage: '',
    bio: ''
  });
  const refM = useRef(null);
  const refMC = useRef(null);

  const options = [
    { value: 'Songs', label: 'Songs' },
    { value: 'Books', label: 'Books' },
    { value: 'Games', label: 'Games' },
    { value: 'Movies', label: 'Movies' },
    { value: 'Cooking', label: 'Cooking' },
    // Add more options as needed
  ];

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{background: theme.card, padding: "8px 12px", border: `1px solid ${theme.border}`, borderRadius: "8px", boxShadow: theme.shadow}}>
          <p style={{margin: 0, color: theme.text, fontSize: "12px", fontWeight: 500}}>{`${label} : ${payload[0].value} notes`}</p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#C49A45", "#6E8B74", "#1A1C1E", "#E5E0D8", "#8B6914", "#4A6B50"];

  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentYear = String(currentDate.getFullYear());
  const currentMonthLabel = months.find(m => m.value === currentMonth)?.label || 'January';

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState({ value: currentMonth, label: currentMonthLabel });


  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleMonthChange = (selected) => {
    setSelectedMonth(selected);
    getDatesData(selected.value, currentYear, "");
    getTagsData(selected.value, currentYear, "");
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

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      getUser("");
      getTagsData(currentMonth, currentYear, "");
      getDatesData(currentMonth, currentYear, "");
      console.log(user);
      getStats("");
    } else {
      navigate("/login");
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setUpdatedUser({...updatedUser, profileImage: base64})
  };

  const showProfileModal = () =>{
    setUpdatedUser({
      name: user.name,
      mobile: user.mobile,
      hobbies: user.hobbies,
      password: "",
      cnfPassword: "",
      profileImage: "",
      bio: user.bio || ""
    })
    if (user.hobbies) {
      const hobbyValues = user.hobbies.split(', ').map(h => ({ value: h, label: h }));
      setSelectedOptions(hobbyValues);
    }
    refM.current.click();
  }

  const handleProfileChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  }

  const updateProfile = () => {
      if(updatedUser.password.length != 0 || updatedUser.cnfPassword.length != 0){
        if(updatedUser.password !== updatedUser.cnfPassword){
          showAlert("Passwords Not Matched", "danger"); return;
        }
      }
      if(updatedUser.name.length < 5){
        showAlert("User Name should be Minimum of 5 characters", "danger"); return;
      }
      const regex = /^\d{10}$/;
      if(!regex.test(updatedUser.mobile)){
        showAlert("Invalid Mobile Number", "danger"); return; 
      }
      
      const hobbies = selectedOptions.map((item) => item.value).join(', ');
      
      updateUser(updatedUser.name, updatedUser.mobile, updatedUser.password, hobbies, updatedUser.profileImage, updatedUser.bio);
      refMC.current.click();
      props.showAlert("Profile Updated Successfully", "success");

  }

  const capitalize = (word)=>{
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  const theme = {
    bg: "#F8F6F0",
    card: "#FFFFFF",
    cardAlt: "#F3EEE3",
    accent: "#C49A45",
    sidebar: "#1A1C1E",
    sage: "#6E8B74",
    text: "#1F2421",
    textMuted: "#6B7280",
    border: "#E5E0D8",
    shadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)",
  };

  const fonts = {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  };

  const initials = (user.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const defaultAvatar = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect fill="#C49A45" width="300" height="300"/><text fill="#fff" font-family="Arial" font-size="120" font-weight="600" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">${initials}</text></svg>`)}`;

  return (
    <div style={{backgroundColor: theme.bg, minHeight: "100vh", fontFamily: fonts.body}}>
      <a href="#" className="btn d-none" ref={refM} data-bs-toggle="modal" data-bs-target="#modal-report">
        Update Profile
      </a>

      {/* Update Profile Modal */}
      <div className="modal modal-blur fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal-report" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document" style={{maxWidth: "440px"}}>
          <div className="modal-content" style={{borderRadius: "16px", border: "none", boxShadow: theme.shadow, padding: "24px"}}>
            <div className="modal-header border-0 p-0 mb-2">
              <h5 className="modal-title" style={{color: theme.text, fontFamily: fonts.heading, fontSize: "20px", fontWeight: 600}}>Update Profile</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div style={{maxHeight: '50px'}} className='w-auto ms-auto'>
              {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                <strong>{capitalize(alert.type)}</strong>: {alert.msg} 
              </div>}
            </div>
            <div className="modal-body p-0">
              <div className="mb-3">
                <label className="form-label" style={{fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: theme.textMuted}}>Name</label>
                <input type="text" className="form-control" style={{borderColor: theme.border, borderRadius: "8px", fontSize: "14px", lineHeight: "20px", backgroundColor: theme.cardAlt}} name="name" value={updatedUser.name} onChange={handleProfileChange} />  
              </div>
              <div className="mb-3">
                <label className="form-label" style={{fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: theme.textMuted}}>Bio</label>
                <textarea className="form-control" style={{borderColor: theme.border, borderRadius: "8px", fontSize: "14px", backgroundColor: theme.cardAlt}} name="bio" rows={3} maxLength={250} value={updatedUser.bio} onChange={handleProfileChange} placeholder="Tell us about yourself..." />
                <small style={{color: theme.textMuted, fontSize: "11px"}}>{(updatedUser.bio || "").length}/250</small>
              </div>
              <div className="mb-3">
                  <label className="form-label" style={{fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: theme.textMuted}}>Profile Picture</label>
                  <div className="d-flex align-items-center gap-2">
                    <input type="file" name="profileImage" accept=".jpeg, .png, .jpg" className="form-control" style={{borderColor: theme.border, borderRadius: "8px", fontSize: "14px", backgroundColor: theme.cardAlt}} onChange={(e) => handleImageUpload(e)} />
                    {(user.profileImage || updatedUser.profileImage) && <button type="button" className="btn" style={{color: "#dc3545", border: `1px solid ${theme.border}`, borderRadius: "8px", fontSize: "13px", whiteSpace: "nowrap", height: "38px", display: "flex", alignItems: "center"}} onClick={() => setUpdatedUser({...updatedUser, profileImage: "remove"})}>
                      <i className="las la-trash-alt me-1"></i> Remove
                    </button>}
                  </div>
              </div>
              <div className="mb-3">
                  <label className="form-label" style={{fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: theme.textMuted}}>Mobile</label>
                  <input type="text" className="form-control" style={{borderColor: theme.border, borderRadius: "8px", fontSize: "14px", backgroundColor: theme.cardAlt}} name="mobile" value={updatedUser.mobile} onChange={handleProfileChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: theme.textMuted}}>Hobbies</label>
                <Select options={options} isMulti value={selectedOptions} onChange={handleSelectChange} />
              </div>
              <div className="mb-3 row g-2">
                <div className="col-12 col-sm-6">
                  <label className="form-label" style={{fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: theme.textMuted}}>Password</label>
                  <input type="password" className="form-control" style={{borderColor: theme.border, borderRadius: "8px", fontSize: "14px", backgroundColor: theme.cardAlt}} name="password" value={updatedUser.password} onChange={handleProfileChange} />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label" style={{fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: theme.textMuted}}>Re-Enter Password</label>
                  <input type="password" className="form-control" style={{borderColor: theme.border, borderRadius: "8px", fontSize: "14px", backgroundColor: theme.cardAlt}} name="cnfPassword" value={updatedUser.cnfPassword} onChange={handleProfileChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 p-0 mt-2">
              <button ref={refMC} className="btn px-4 py-2" style={{borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "14px"}} data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn ms-auto text-white px-4 py-2" style={{backgroundColor: theme.sidebar, borderRadius: "8px", fontSize: "14px"}} onClick={updateProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="px-3 px-md-4 pt-3 pb-1">
        <h4 className="mb-0" style={{color: theme.text, fontFamily: fonts.heading, fontSize: "28px", fontWeight: 600, lineHeight: "36px"}}>iNotebook Profile</h4>
      </div>

      {/* User Info Section */}
      <section className="px-3 px-md-4 pb-2 pt-2">
        <p className="mb-2" style={{color: theme.text, fontFamily: fonts.heading, fontSize: "20px", fontWeight: 600, lineHeight: "28px"}}>User info</p>
        <div className="card border-0" style={{backgroundColor: theme.card, borderRadius: "16px", boxShadow: theme.shadow, padding: "20px"}}>
            <div className="d-flex">
              <img src={user.profileImage || defaultAvatar} alt="" onError={(e) => {e.target.src = defaultAvatar}} style={{width: "150px", height: "150px", borderRadius: "9999px", objectFit: "cover", border: `3px solid ${theme.accent}`, flexShrink: 0, backgroundColor: theme.accent}} />
              <div className="ms-4 flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h4 className="mb-0" style={{color: theme.text, fontFamily: fonts.heading, fontSize: "24px", fontWeight: 600, lineHeight: "32px"}}>{user.name}</h4>
                  <button className="btn text-white px-3" style={{backgroundColor: theme.sidebar, borderRadius: "8px", fontSize: "12px", fontWeight: 500, padding: "8px 16px"}} onClick={showProfileModal}>
                    <i className="las la-pen me-1"></i> Update Profile
                  </button>
                </div>
                <p className="mb-2" style={{color: theme.textMuted, fontSize: "14px", lineHeight: "20px", fontWeight: 400}}>{user.bio || "Update your profile to add a bio"}</p>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <span style={{color: theme.text, fontSize: "14px", lineHeight: "20px", fontWeight: 600}}>Hobbies :</span>
                  {user.hobbies ? user.hobbies.split(', ').map((hobby, i) => (
                    <span key={i} style={{backgroundColor: theme.cardAlt, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 500, lineHeight: "18px", height: "32px", display: "inline-flex", alignItems: "center"}}>{hobby}</span>
                  )) : <span style={{color: theme.textMuted, fontSize: "13px"}}>No hobbies added</span>}
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="las la-phone" style={{color: theme.accent, fontSize: "1.1rem"}}></i>
                      <span style={{color: theme.text, fontSize: "14px", lineHeight: "20px", fontWeight: 400}}>{user.mobile || "—"}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="las la-envelope" style={{color: theme.accent, fontSize: "1.1rem"}}></i>
                      <span style={{color: theme.text, fontSize: "14px", lineHeight: "20px", fontWeight: 400}}>{user.email || "—"}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="las la-calendar" style={{color: theme.accent, fontSize: "1.1rem"}}></i>
                      <span style={{color: theme.text, fontSize: "12px", lineHeight: "16px", fontWeight: 400}}>Joined: {user.date ? new Date(user.date).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="px-3 px-md-4 pb-3 pt-1">
        <p className="mb-2" style={{color: theme.text, fontFamily: fonts.heading, fontSize: "20px", fontWeight: 600, lineHeight: "28px"}}>Analytics</p>
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <div className="card border-0 h-100" style={{backgroundColor: theme.card, borderRadius: "16px", boxShadow: theme.shadow, overflow: "hidden"}}>
              <div className="card-body" style={{overflow: "hidden"}}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0" style={{color: theme.text, fontSize: "14px", fontWeight: 600}}>Notes Frequency</h6>
                  <Select
                    options={months}
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    styles={{
                      container: (base) => ({...base, width: '130px'}),
                      control: (base) => ({...base, minHeight: '32px', fontSize: '12px', borderColor: theme.border, borderRadius: '8px'}),
                    }}
                  />
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={datesData} margin={{top: 5, right: 10, left: -10, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: theme.textMuted}} />
                    <YAxis tick={{fontSize: 12, fill: theme.textMuted}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Notes" barSize={16} fill={theme.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="card border-0 h-100" style={{backgroundColor: theme.card, borderRadius: "16px", boxShadow: theme.shadow, overflow: "hidden"}}>
              <div className="card-body" style={{overflow: "hidden"}}>
                <h6 className="mb-3" style={{color: theme.text, fontSize: "14px", fontWeight: 600}}>Content Distribution</h6>
                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Pie data={tagsData} dataKey="value" cx="50%" cy="50%" outerRadius={90} fill="black" label>
                      {tagsData.map((tag, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="row g-3 h-100">
              <div className="col-12">
                <div className="card border-0" style={{backgroundColor: theme.card, borderRadius: "16px", boxShadow: theme.shadow, minHeight: "100px"}}>
                  <div className="card-body d-flex align-items-center gap-3 p-3 px-4">
                    <div className="d-flex align-items-center justify-content-center" style={{width: "48px", height: "48px", borderRadius: "12px", backgroundColor: theme.cardAlt}}>
                      <i className="las la-pen-fancy fs-2" style={{color: theme.accent}}></i>
                    </div>
                    <div>
                      <h3 className="mb-0" style={{color: theme.text, fontSize: "24px", fontWeight: 700}}>{stats.totalNotes || 0}</h3>
                      <p className="mb-0" style={{color: theme.textMuted, fontSize: "14px", lineHeight: "20px", fontWeight: 600}}>Notes Written</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card border-0" style={{backgroundColor: theme.card, borderRadius: "16px", boxShadow: theme.shadow, minHeight: "100px"}}>
                  <div className="card-body d-flex align-items-center gap-3 p-3 px-4">
                    <div className="d-flex align-items-center justify-content-center" style={{width: "48px", height: "48px", borderRadius: "12px", backgroundColor: theme.cardAlt}}>
                      <i className="las la-images fs-2" style={{color: theme.sage}}></i>
                    </div>
                    <div>
                      <h3 className="mb-0" style={{color: theme.text, fontSize: "24px", fontWeight: 700}}>{stats.totalImages || 0}</h3>
                      <p className="mb-0" style={{color: theme.textMuted, fontSize: "14px", lineHeight: "20px", fontWeight: 600}}>Images Uploaded</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card border-0" style={{backgroundColor: theme.card, borderRadius: "16px", boxShadow: theme.shadow, minHeight: "100px"}}>
                  <div className="card-body d-flex align-items-center gap-3 p-3 px-4">
                    <div className="d-flex align-items-center justify-content-center" style={{width: "48px", height: "48px", borderRadius: "12px", backgroundColor: theme.cardAlt}}>
                      <i className="las la-calendar-check fs-2" style={{color: theme.sidebar}}></i>
                    </div>
                    <div>
                      <h3 className="mb-0" style={{color: theme.text, fontSize: "24px", fontWeight: 700}}>{stats.totalUniqueDates || 0}</h3>
                      <p className="mb-0" style={{color: theme.textMuted, fontSize: "14px", lineHeight: "20px", fontWeight: 600}}>Days Written</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;


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