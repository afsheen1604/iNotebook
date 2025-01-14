import React, { useState,useContext } from 'react'
import { useNavigate,Link } from 'react-router-dom'
// import{useForm} from 'react-hook-form'
import gif from './logingif.gif'
import spinner from './spinning.gif'
// import OTPInput from 'react-otp-input'
import './login.css'
import loginlogo from './log mw.png'
// import MultiSelect from 'react-multiple-select-dropdown-lite'
import Select from 'react-select'
// import 'react-multiple-select-dropdown-lite/dist/index.css'
const MAX_STEPS=3;
const Signup = (props) => {

 
    const [credentials, setCredentials] = useState({name:"", email:"", password:"", cpassword:"",mobile:""})
    const navigate = useNavigate();
    const[selectedOptions,setSelectedOptions]=useState([]);
  const[otp,setOtp]=useState("");
  const[showotp,setShowotp]=useState(false)
  const[isLoading,setIsLoading]=useState(false)
  const[nxt,setNxt]=useState(false)
  const[send,setSend]=useState(true)
  const [isDisabled, setIsDisabled] = useState(false);

;    const  handleOnchangeHobby =  (val)  => {
      if (val && val.length <= 3) {
  setSelectedOptions(val|| []);
      }
    }
    const otpsent=(val)=>{
      setOtp(val);
    }
   
    const options=[
      { label:"Movies", value: 'Movies'},
      { label:"Books",value:'books'},
      { label:"Games",value:'Games'},
      { label:"Music",value:'Music'}
    ]
    const heading="User Registration";
    const purpose="to verify email.";
    const sendOtp = async (e) => {
      e.preventDefault();

      if (credentials.email === "") {
          props.showAlert("Enter Your Email !","danger")
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
          props.showAlert("Enter Valid Email !","danger")
      } else {
  
          setIsLoading(true);
          const response = await fetch("http://localhost:5000/api/auth/userotpsend", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email,heading:heading,purpose:purpose})
        });

          if (response.status === 200) {
            setSend(false)
            setIsDisabled(!isDisabled)
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
            body: JSON.stringify({ email: credentials.email,otp:otp})
        });
      if (response.status === 200) {
        setShowotp(false)
        setNxt(true)
        props.showAlert("Email verified successfully","success")
        console.log("otp verified")
      } else {
        props.showAlert("error","danger")
      }
    }
  }
  

    const handleSubmition = async () => {
      const hobbies=selectedOptions.map((item)=>item.value).join(', ');
        // e.preventDefault();

        
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name:credentials.name, email: credentials.email, password: credentials.password ,mobile:credentials.mobile,hobbies:hobbies})
        });
        const json = await response.json()
        console.log(json);
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authToken)
            navigate('/');
            props.showAlert("Account created successfully", "success");

        }
        else {
          props.showAlert("error Occured", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const[formStep,setFormStep]=useState(0)
    // const{ handleSubmit}=useForm()

    const completeFormStep=()=>{
      if(formStep==1){ 
      if(credentials.mobile.length !==10){
        props.showAlert("Enter Valid Mobile Number", "danger");
        return;
    }
    if(credentials.password !== credentials.cpassword){
        props.showAlert("Passwords not matched", "danger");
        return;
    }
      setFormStep(cur=>cur+1)
  }
  else{
    setFormStep(cur=>cur+1)
  }
    }
    const prevStep=()=>{
      setFormStep(cur=>cur-1)
    }
    const renderButton=()=>{
      if(formStep>2){
        return undefined;
      }
      else if(formStep===2){
        return (
          
          <button  onClick={handleSubmition}   className="btn  w-100" style={{backgroundColor:"#3f2b34d1",color:"white"}}>Create new account</button>
          
    
        )
      }
      else{
        return(
          <button onClick={completeFormStep}  className="btn w-100 " style={{backgroundColor:"#3f2b34d1",color:"white"}}>Next</button>
 
        )
      }
    }
    

    return (
        <div className="mainlogin m-0" style={{backgroundColor:"#5a1734"}}>
          <div className="login_content">
              <div className="login_img" style={{backgroundColor:"white"}}
              >
                <img src={gif}></img>
              </div>
              <div className="login_form" >
                <div className="signinform" style={{backgroundColor:"white"}} >
              {/* <form className="signinform"  onSubmit={handleSubmit(handleSubmition)}   autoComplete="off" noValidate > */}
        {/* <div className="text-center mb-4">
          <a href="." className="navbar-brand navbar-brand-autodark"><img src="./static/logo.svg" height="36" alt=""></img></a>
        </div> */}
        <div className="loginpagelogo">
            <img className='centered-image' src={loginlogo}/>
        </div>
        {/* <h1 className="h1 text-center mb-3" style={{fontFamily:"Brush Script MT,cursive",color:"#206bc4",fontSize:"55px"}}>Dear Me</h1> */}
        <h2 className="h2 text-center mb-3">Create new account</h2>
       <div className="flex items-center mb-2 ">
      {formStep>0 &&( <button style={{all:"unset",cursor:"pointer"}} onClick={prevStep}>
        <span><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left mr-2 mt-1"  viewBox="0 0 26 26" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M15 6l-6 6l6 6"></path>
</svg> </span></button>
 )}
<span>Step {formStep+1} of {MAX_STEPS}</span>
     
</div>
        {formStep===0 &&(<section>
        <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" disabled={isDisabled} value={credentials.email} onChange={onChange} id="email" name="email" placeholder="Enter email"/>
              
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
             { nxt && (
                <button onClick={completeFormStep} style={{backgroundColor:"#3f2b34d1",color:"white"}}  className="btn  w-100 mt-3">Next</button>
              )}
              
              </div> 

        </section>)}
        {formStep===1 &&(<section>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" value={credentials.name} onChange={onChange} name="name" id="name" minLength={3} placeholder="Enter name"/>
            </div>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">Mobile Number</label>
              <input type="text" className="form-control" value={credentials.mobile} onChange={onChange} name="mobile" id="mobile"  placeholder="Enter mobile number"/>
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group input-group-flat">
                <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" minLength={5}  placeholder="Password"  autoComplete="off"/>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="cpassword" className="form-label">Confirm Password</label>
              <div className="input-group input-group-flat">
                <input type="password" className="form-control" value={credentials.cpassword} onChange={onChange} name="cpassword" id="cpassword" minLength={5}  placeholder="Password"  autoComplete="off"/>
              </div>
            </div>
            {renderButton()}
            </section>)}
            {formStep===2 &&(<section>
              <div className="mb-3">
              <label htmlFor="name" className="form-label">Hobbies</label>
              {/* <MultiSelect placeholder='select any three hobbies' options={options} value={selectedOptions} onChange={handleOnchangeHobby} /> */}
              <Select options={options} placeholder='select any three hobbies' isMulti value={selectedOptions} onChange={handleOnchangeHobby}/>
              
            </div>
            {renderButton()}
            </section>)}
            
       
        <div className="text-center text-muted mt-3">
          Already have account? <Link to="/login" style={{color:"#5a1734"}}>Sign in</Link>
        </div>
        {/* </form> */}
        </div>
      </div>
      </div>
        </div>
    )
}

export default Signup