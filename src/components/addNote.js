import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import React, { useContext, useEffect, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { Navigate, useNavigate } from "react-router-dom";
import img from  "./timg3.jpg"
// import './addnotecss.css'

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const navigate = useNavigate();

  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  const [postImage, setPostImage] = useState([]);
  const [postVideo, setPostVideo] = useState([]);

  useEffect(() => {
    const backgroundImageUrl = `url(${img})`;
    // document.body.style.backgroundImage = backgroundImageUrl;
    // document.body.style.backgroundSize = "cover";
    // document.body.style.backdropFilter = "blur(3px)";
    props.setImageUrl(backgroundImageUrl);

    // Clean up the effect by removing the background image when the component unmounts
    return () => {
      props.setImageUrl("");
      // document.body.style.backgroundImage = "";
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    // console.log(postImage);
    addNote(note.title, note.description, note.tag, postImage);
    setNote({ title: "", description: "", tag: " " });
    setPostImage([]);
    navigate('/');
    props.showAlert("Note Added Successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const descriptionChange = (e) => {
    setNote({ ...note, description: e});
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    
    setPostImage([...postImage, base64]);
  };

  const removeImage = (index) => {
    setPostImage(prevState => prevState.filter((_, i) => i !== index));
  };


const styles={
  container: {
    position: "relative",
    top: "-40px"
    
},
h2:{
    color:"black"

},

form: {
    maxWidth: "900px",
    margin:" 0 auto",
    padding: "20px",
  },


  
  formcontrol :{
    width: "100%",
    // padding: "10px",
    marginBottom: "15px",
    border: "2px solid #ddd",
    borderRadius:"8px",
    boxShadow:"0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff"
    /* transition: border-color 0.3s ease; */
  },
  cardcontainer:{
    position:"relative",


  },
  cardstyle:{
    backgroundColor:"#fff",
    //  height:"100%",
    //  width:"100%",
    // padding: " 2px 20px",
    borderRadius:"8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    
  },

  btn:{
    //  position:"absolute",
    backgroundColor: "#5a1734",
    color:"#fff",
    width: "20%",
    borderRadius: "8px",
    boxShadow:" 0 0 20px rgba(0, 0, 0, 0.1)"

  },
  formlabel:{
    color:"black",
    fontSize: "16px"
  }
}
// style={{backgroundImage: `url(${img})`,position:"relative"}}
  return (
   <div className='p-4' style={{backgroundImage: `url(${img})`}}>
         
          <div className="card m-auto mt-4" style={{transform:"rotate(-3deg)", width: "65%", backgroundColor: "var(--tblr-border-color-translucent)", borderRadius: "15px"}}  >
           
            <div className="card " style={{transform:"rotate(3deg)", borderRadius: "15px", backgroundColor: "#e3afbc"}} >
             <div className="card-body"> 
            <form className="my-3 row" style={styles.form}>
            <h2 style={styles.h2}> <span><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-ballpen-filled" width="22" height="22" viewBox="0 0 22 22" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M17.828 2a3 3 0 0 1 1.977 .743l.145 .136l1.171 1.17a3 3 0 0 1 .136 4.1l-.136 .144l-1.706 1.707l2.292 2.293a1 1 0 0 1 .083 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.497 -1.32l.083 -.094l3.292 -3.293l-1.586 -1.585l-7.464 7.464a3.828 3.828 0 0 1 -2.474 1.114l-.233 .008c-.674 0 -1.33 -.178 -1.905 -.508l-1.216 1.214a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.214 -1.216a3.828 3.828 0 0 1 .454 -4.442l.16 -.17l10.586 -10.586a3 3 0 0 1 1.923 -.873l.198 -.006zm0 2a1 1 0 0 0 -.608 .206l-.099 .087l-1.707 1.707l2.586 2.585l1.707 -1.706a1 1 0 0 0 .284 -.576l.01 -.131a1 1 0 0 0 -.207 -.609l-.087 -.099l-1.171 -1.171a1 1 0 0 0 -.708 -.293z" stroke-width="0" fill="currentColor"></path></svg></span> 
             <span style={{paddingLeft:"10px"}}>Add a Note</span></h2>
            <div className="mb-3 col-6">
              <label style={styles.formlabel} className="form-label">Title</label>
              <input type="text" className="form-control" style={styles.formcontrol} placeholder="Give a title!" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={onChange}/>
            </div>
            <div className="mb-3 col-6">
              <label style={styles.formlabel}  className="form-label">
                <span><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-tag" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="8.5" cy="8.5" r="1" fill="currentColor"></circle><path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z"></path></svg></span><span>Tag</span></label>
              <input type="text" className="form-control" style={styles.formcontrol} id="tag" name="tag" value={note.tag} aria-describedby="emailHelp" onChange={onChange}/>
            </div>
            <div className="mb-3">
            <label style={styles.formlabel} className="form-label"> <span> <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-pencil" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M10 18l5 -5a1.414 1.414 0 0 0 -2 -2l-5 5v2h2z"></path></svg></span>
             <span>  Description</span></label>
              <ReactQuill style={styles.formcontrol} id="description" name="description" value={note.description} onChange={descriptionChange} />
              {/* <textarea rows={10}
                className="form-control"
                id="description"
                name="description"
                value={note.description}
                onChange={onChange}
                placeholder="what's on your mind?"
              /> */}
            </div>
            <div className="mb-3">
              <label style={styles.formlabel} className="form-label">Upload Images
              <span><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-upload" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M12 11v6"></path><path d="M9.5 13.5l2.5 -2.5l2.5 2.5"></path></svg></span></label>
              <input type="file" label="Image" name="myFile" id="image-upload" accept=".jpeg, .png, .jpg" style={styles.formcontrol}className="form-control" onChange={(e) => handleImageUpload(e)} />
            </div>
            

            {postImage.length!==0&&<div className="mb-3">
              <label style={styles.formlabel} className="form-label">Uploaded Images</label>
              <div className="row">
              {postImage.map((img, index) => (
                    <div className="col-3" key={index}>
                        <div className="btn" style={styles.btn} onClick={() => removeImage(index)}>x</div>
                        <img src={img} alt="Stored Image" style={{ width: "150px" }} />
                    </div>
                ))}
              </div></div>}
            <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" style={styles.btn} className="btn" onClick={handleClick}>
              Submit
            </button>
          </form>
          </div>
          </div>
          </div>
      </div>
  );
};

export default AddNote;

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



