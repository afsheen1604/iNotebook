import React, { useState,useContext,useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import image from './img2.jpg'
import gif from './logingif.gif'
import spinner from './spinning.gif'
import{Link} from  'react-router-dom'
import './login.css'
import loginlogo from './log mw.png'
import noteContext from '../context/notes/noteContext'
// import { use } from '../../backend/routes/auth'


const Login = (props) => {
  const[updatepassword,setUpdatepassword]=useState({
    email:"",
    newpassword:"",
    cnewpassword:"",
  })
  const heading="forgot password";
  const purpose="to change password.";

    const [credentials, setCredentials] = useState({ email: "", password: ""})
    //let history = useHistory();
    const navigate = useNavigate();
    const[formStep,setFormStep]=useState(0)
    const[otp,setOtp]=useState("");
    const[showotp,setShowotp]=useState(false)
    const[isLoading,setIsLoading]=useState(false)
    const[send,setSend]=useState(true)
    const nxtStep=()=>{
      setFormStep(cur=>cur+1)
    }
    const sendOtp = async (e) => {
      e.preventDefault();

      if (updatepassword.email === "") {
          props.showAlert("Enter Your Email !","danger")
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatepassword.email)) {
          props.showAlert("Enter Valid Email !","danger")
      } else {
  
          setIsLoading(true);
          const response = await fetch("http://localhost:5000/api/auth/userotpsend", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: updatepassword.email,heading:heading,purpose:purpose})
        });

          if (response.status === 200) {
            setSend(false)
            setShowotp(true);
            setIsLoading(false);
            props.showAlert("OTP sended successfully","success")

              console.log("otp sent")
          } else {
              setIsLoading(false);
              props.showAlert("error","danger");
          }
      }
  }
  const verifyOtp = async (e) => {
    e.preventDefault();

    if (otp === "") {
      props.showAlert("Enter Your Otp","danger")
    } else if (!/[^a-zA-Z]/.test(otp)) {
      props.showAlert("Enter Valid Otp","danger")
    } else if (otp.length < 6) {
      props.showAlert("Otp Length minimum 6 digit","danger")
    } else {

      const response = await fetch("http://localhost:5000/api/auth/userotpverify", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: updatepassword.email,otp:otp})
        });
      if (response.status === 200) {
        setFormStep(cur=>cur+1)
        setShowotp(false)
        props.showAlert("Email verified successfully","success")
        console.log("otp verified")
      } else {
        props.showAlert("error","danger")
      }
    }
  }
  const changedpass= async(e)=>{
    e.preventDefault();
    if(updatepassword.newpassword !== updatepassword.cnewpassword){
      props.showAlert("Passwords not matched", "danger");
      return;
  }
  const response = await fetch("http://localhost:5000/api/auth/forgotPassword", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reqemail: updatepassword.email,password:updatepassword.newpassword})
        });
    // updateUser(updatepassword.name,updatepassword.mobile,updatepassword.newpassword,updatepassword.hobbies,updatepassword.profileImage);
    // refMC.current.click();
    if(response.status==200){
      navigate('/');
    props.showAlert("Password changed successfully","success");

    }
    else{
      props.showAlert("error","danger");
    }
    
  }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        console.log(json);
        if (json.success) { 
            // Save the auth token and redirect
            localStorage.setItem('token', json.authToken)
            navigate('/');
            props.showAlert("Logged in successfully", "success");
        }
        else {
            props.showAlert("Invalid credentials", "danger");
        }
    }
    
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })

    }
    const passChange = (e) => {
      setUpdatepassword({ ...updatepassword, [e.target.name]: e.target.value })

  }

    return (
        <div className="mainlogin m-0 " style={{backgroundColor:"#5a1734"}}>
            <div className="login_content">
              <div className="login_img" style={{backgroundColor:"#white"}}
              >
                <img src={gif}></img>
              </div>
              <div className="login_form"  >
            <div className="signinform" style={{backgroundColor:"white"}} >
            {/* <div className="text-center mb-4">
          
          <a href="." className="navbar-brand navbar-brand-autodark"><img src="./static/logo.svg" height="36" alt=""></img></a>
        </div> */}
        <div className="loginpagelogo">
            <img className='centered-image' src={loginlogo}/>
        </div>
        {/* <h1 className="h1 text-center mb-3" style={{fontFamily:"Brush Script MT,cursive",color:"#206bc4",fontSize:"55px"}}>Dear Me</h1> */}

            {formStep===0 &&(<section> <h2 className="h2 text-center mb-3">Login to your account</h2>
              <div className="mb-3">
                <label htmlFor ="email" className="form-label">Email address</label>
                <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email"placeholder="your@email.com" autoComplete="off"/>
              </div>
              <div className="mb-2">
                <label className="form-label">
                  Password
                  <span className="form-label-description">
                    <button className="btn w-100" style={{height:"20px",fontSize:"10px",border:"none"}}  onClick={nxtStep}>Forgot password?</button>
                  </span>
                </label>
                <div className="input-group input-group-flat">
                  <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" placeholder="Your password"  autoComplete="off"/>
                  {/* <span className="input-group-text">
                    <a href="/" className="link-secondary" title="Show password" data-bs-toggle="tooltip">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>
                    </a>
                  </span> */}
                </div>
              </div>
              {/* <div className="mb-2">
                <label className="form-check">
                  <input type="checkbox" className="form-check-input"/>
                  <span className="form-check-label">Remember me on this device</span>
                </label>
              </div> */}
              <div className="form-footer">
                <button type="submit" onClick={handleSubmit} className="btn  w-100 " style={{backgroundColor:"#3f2b34d1",color:"white"}}>Sign in</button>
              </div>
            
         
        
        <div className="text-center text-muted mt-3 " >
          Don't have account yet? <Link to="/signup" style={{color:"#5a1734"}} tabIndex="-1">Sign up</Link>
      </div>
      </section>)}
      {formStep===1 &&( <section>
        <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control"  value={updatepassword.email} onChange={passChange} id="email" name="email" placeholder="Enter email"/>

              {
                showotp&&(
                <div className="mt-3">
              <div className="mb-3">
              <label htmlFor="otp" className='form-label'> Enter your OTP</label>
              <input type="text" name="otp" className="form-control"    onChange={(e) => setOtp(e.target.value)} placeholder='Enter your OTP'  />
              <button className='btn w-100 mt-3'style={{backgroundColor:"#3f2b34d1",color:"white"}} onClick={verifyOtp}>Verify</button>
            </div>
            </div>
            
              )} 
              {send &&(
                <div className="mt-3"> 
              <button className='btn  w-100' style={{backgroundColor:"#3f2b34d1",color:"white"}} onClick={sendOtp} disabled={isLoading}>
                {isLoading ?
                <img src={spinner}></img>
                 : <span> Send OTP</span>}
                
               </button>
              </div>
              )}
              
              </div>
      </section>

      )}
      {formStep===2 &&( <section>
        <div className="mb-3">
              <label htmlFor="newpassword" className="form-label">Enter New Password</label>
              <div className="input-group input-group-flat">
                <input type="password" className="form-control" value={updatepassword.newpassword}  onChange={passChange} name="newpassword" id="newpassword" minLength={5}  placeholder="New Password"  autoComplete="off"/>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="cnewpassword" className="form-label">Re-Enter New Password</label>
              <div className="input-group input-group-flat">
                <input type="password" className="form-control" value={updatepassword.cnewpassword}  onChange={passChange} name="cnewpassword" id="cnewpassword" minLength={5}  placeholder="Re-enter new Password"  autoComplete="off"/>
              </div>
            </div>
            <button onClick={changedpass} className='btn w-100 mt-3'style={{backgroundColor:"#3f2b34d1",color:"white"}} >Confirm</button>
              
      </section>

      )}
      </div>
      </div>
      
        </div>
        </div>
        // </div>
    // </div>
    // </div>
    // </div>
    )
}

export default Login