import React, { useContext, useEffect, useRef, useState } from "react";
import Select from 'react-select';
import noteContext from "../context/notes/noteContext"
// import "./pro.css";
import { Navigate, useParams } from "react-router-dom";
import { PieChart, Pie, Tooltip, Sector, Cell, Label, BarChart,
  Bar,
  XAxis,
  YAxis, 
  CartesianGrid,
  Legend } from "recharts";
// import PieChart from './PieChart';

import img from './timg3.jpg'
function ViewUser( props ) {
  const context = useContext(noteContext);
  const params = useParams();

  const { user, getUser, updateUser, getTagsData, tagsData, datesData, getDatesData, stats, getStats } = context;
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    mobile: '',
    hobbies: '',
    password: '',
    cnfPassword: '',
    profileImage: ''
  });
  const ref = useRef(null);
  const refM = useRef(null);
  const refMC = useRef(null);

  const options = [
    { value: 'Sports', label: 'Sports' },
    { value: 'Movies', label: 'Movies' },
    { value: 'Music', label: 'Music' },
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
    { value: '08', label: 'August' }
    // Add more options as needed
  ];

  const getIntroOfPage = (label) => {
    if (label === "Page A") {
      return "Page A is about men's clothing";
    }
    if (label === "Page B") {
      return "Page B is about women's dress";
    }
    if (label === "Page C") {
      return "Page C is about women's bag";
    }
    if (label === "Page D") {
      return "Page D is about household goods";
    }
    if (label === "Page E") {
      return "Page E is about food";
    }
    if (label === "Page F") {
      return "Page F is about baby food";
    }
    return "";
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}/06/2023 : ${payload[0].value}`}</p>
          <p className="intro">{getIntroOfPage(label)}</p>
          <p className="desc">Anything you want can be displayed here.</p>
        </div>
      );
    }
  
    return null;
  };


  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  

  const COLORS = ["red", "blue", "green", "orange", "purple", "yellow"];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState({ value: '07', label: 'July' });


  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleMonthChange = (selected) => {
    setSelectedMonth(selected);
    console.log(selected);
    getDatesData(selected.value, "2023", params.userid);
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
      getUser(params.userid);
      getTagsData("07", "2023", params.userid);
      getDatesData("07", "2023", params.userid);
      console.log(user);
      getStats(params.userid);
    } else {
      Navigate("/login");
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
      profileImage: ""
    })
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
      
      updateUser(updatedUser.name, updatedUser.mobile, updatedUser.password, hobbies, updatedUser.profileImage);
      refMC.current.click();
      props.showAlert("Profile Updated Successfully", "success");

  }

  const capitalize = (word)=>{
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  return (
    <div div className="p-4" style={{backgroundImage: `url(${img})`, minHeight: "100vh"}}>
      <a href="#" className="btn d-none" ref={refM} data-bs-toggle="modal" data-bs-target="#modal-report">
        Update Profile
      </a>
      <div className="modal modal-blur fade" data-bs-backdrop="static" data-bs-keyboard="false" id="modal-report" tabindex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Profile</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div style={{maxHeight: '50px'}} className='w-auto ms-auto mt-2'>
              {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                <strong>{capitalize(alert.type)}</strong>: {alert.msg} 
              </div>}
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" value={updatedUser.name} onChange={handleProfileChange} />  
              </div>
              <div className="mb-3 row">
                <div className="col-6">
                  <label className="form-label">Upload Profile Picture <span><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-upload" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M12 11v6"></path><path d="M9.5 13.5l2.5 -2.5l2.5 2.5"></path></svg></span></label>
                  <input type="file" label="Image" name="profileImage" accept=".jpeg, .png, .jpg" className="form-control" onChange={(e) => handleImageUpload(e)} />
                </div>
                <div className="col-6">
                  <label className="form-label">Mobile</label>
                  <input type="text" className="form-control" name="mobile" value={updatedUser.mobile} onChange={handleProfileChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Hobbies</label>
                <Select
                  options={options}
                  isMulti
                  value={selectedOptions}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="mb-3 row">
                <div className="col-6">
                  <label className="form-label">Update Password</label>
                  <input type="text" className="form-control" name="password" value={updatedUser.password} onChange={handleProfileChange} />
                </div>
                <div className="col-6">
                  <label className="form-label">Re-Enter Password</label>
                  <input type="text" className="form-control" name="cnfPassword" value={updatedUser.cnfPassword} onChange={handleProfileChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button ref={refMC} className="btn btn-outline" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn ms-auto text-white" style={{backgroundColor: "#5a1734"}} onClick={updateProfile}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* <div className="content">
        <div className="row">
          <div className="col-md-6 mb-6">
            <div className="pro">
              <div className="firstinfo">
                <img src={user.profileImage} alt="none"/>
                <div className="profileinfo">
                  <h1>{user.name}</h1>
                  <h3>{user.email}</h3>
                  <p className="bio">
                    Intrested in Movies like Sci-Fi, and also a sports person.
                  </p>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
          <a href="/">
              <button className="bn632-hover bn26">IMAGES</button>
            </a>
            <button href="#" className="btn" onClick={showProfileModal}>
              Update Profile
            </button>
          </div>

          <div className="col-md-6 mb-6">
            <div className="card-pro">
              <div className="card1">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.mobile}
                </p>
                <p>
                  <strong>Hobbies:</strong>{user.hobbies}
                </p>
                <p>
                  <strong>Date Joined:</strong> {new Date(user.date).toLocaleDateString()}
                </p>

                <div className="go-corner" href="#">
                  <div className="go-arrow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}


      <section className="p-4 section about-section gray-bg" id="about">
          <div className="container">
                <div className="row align-items-center flex-row-reverse">
                    <div className="col-lg-6">
                        <div className="about-text card go-to" style={{backgroundColor: "#efdfdd", borderRadius: "10px"}}>
                          <div className="card-body">
                            <h3 className="dark-color mb-3 gap-4 d-flex align-items-center">{user.name}</h3>
                            <h6 className="theme-color lead">A Lead UX &amp; UI designer based in Canada</h6>
                            <p>I <mark>design and develop</mark> services for customers of all sizes, specializing in creating stylish, modern websites, web services and online stores. My passion is to design digital user experiences through the bold interface and meaningful interactions.</p>
                            <div className="row about-list">
                                <div className="col-md-6">
                                    <div className="media">
                                        <label><b>Phone</b></label>
                                        <p>{user.mobile}</p>
                                    </div>
                                    <div className="media">
                                        <label><b>Hobbies</b></label>
                                        <p>{user.hobbies}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media">
                                        <label><b>E-mail</b></label>
                                        <p>{user.email}</p>
                                    </div>
                                    <div className="media">
                                        <label><b>Date Joined</b></label>
                                        <p>{new Date(user.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="about-avatar">
                            <img className="m-auto" src={user.profileImage} title="" alt="" style={{width: "18rem", height: "18rem", borderRadius: "100%", objectFit: "cover"}} />
                        </div>
                    </div>
                </div>
              </div>
      </section>

      <div className="d-flex card mx-4 mb-4  flex-row align-items-center justify-content-between" style={{backgroundColor: "#efdfdd", borderRadius: "10px"}}>
        <div className="">
          <Select
            options={months}
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-25 ms-5 mb-2"
          />
          <BarChart
            width={750}
            height={300}
            data={datesData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Notes" barSize={20} fill="#5a1734" />
          </BarChart>
        </div>
        <div className="">
          <PieChart width={450} height={450}>
            <Pie
              data={tagsData}
              dataKey="value"
              cx={200}
              cy={200}
              outerRadius={120}
              fill="black"
              label
            >
              {/* Add colors to each segment of the pie */}
              {tagsData.map((tag, entry, index) => (
                <Cell key={`cell-${index}`} fill={"#5a1734"} />
              ))}

              

            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <section className="p-4 pt-0 section about-section gray-bg" id="about">
        <div className="counter mt-5">
                    <div className="row justify-content-center">
                            <div className="col-6 col-lg-3">
                                <div className="card" style={{backgroundColor: "#efdfdd", borderRadius: "10px"}}>
                                  <div className="card-body">
                                    <div className="count-data text-center">
                                        <h6 className="count h2" data-to="500" data-speed="500" style={{color: "#5a1734"}}>{stats.totalNotes}</h6>
                                        <p className="mb-0 font-w-600">Notes Written</p>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="card" style={{backgroundColor: "#efdfdd", borderRadius: "10px"}}>
                                  <div className="card-body">
                                    <div className="count-data text-center">
                                        <h6 className="count h2" data-to="150" data-speed="150" style={{color: "#5a1734"}}>{stats.totalImages}</h6>
                                        <p className="mb-0 font-w-600">Images Uploaded</p>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="card" style={{backgroundColor: "#efdfdd", borderRadius: "10px"}}>
                                  <div className="card-body">
                                    <div className="count-data text-center">
                                        <h6 className="count h2" data-to="850" data-speed="850" style={{color: "#5a1734"}}>{stats.totalUniqueDates}</h6>
                                        <p className="mb-0 font-w-600">Days Written</p>
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

export default ViewUser;


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