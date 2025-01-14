import {React,useState ,createRef, useContext, useEffect } from 'react'
import 'react-html5video/dist/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCircleChevronLeft, 
  faCircleChevronRight, 
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons'
import './ViewDiary.css'
import img from './timg3.jpg'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import noteContext from '../context/notes/noteContext'; 
import {DayPicker} from 'react-day-picker';
    
const ViewDiary = (props) => {

  const [slideNumber, setSlideNumber] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null);
  const [today, setToday] = useState(null);
  const [choosendate, setChoosenDate] = useState(null);
  const [state, setState] = useState("A");
  const [postImage, setPostImage] = useState([]);

  const [description, setDescription] = useState(null);


  const context = useContext(noteContext);
  const {diary, getDiary, updateDiary } = context;

  
  
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    // console.log(date);
    setSelectedDate(date);
    setChoosenDate(date.toLocaleDateString('en-GB'));
    getDiary(date.toLocaleDateString('en-GB'));
    // getNotes(date.toLocaleDateString('en-GB'));
  };

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const currentDate = new Date();

      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();

      const date = `${day}/${month}/${year}`;
      console.log(date);
      setToday(date);
      setChoosenDate(date);

      getDiary(date);
      
    } else {
      navigate("/login");
    }
  }, []);
  

  const handleOpenModal = (index) => {
    setSlideNumber(index);
    setOpenModal(true);
  }

  // Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
  }

  // Previous Image
  const prevSlide = () => {
    slideNumber === 0 
    ? setSlideNumber( diary.image.length -1 ) 
    : setSlideNumber( slideNumber - 1 )
  }

  // Next Image  
  const nextSlide = () => {
    slideNumber + 1 === diary.image.length ? setSlideNumber(0) : setSlideNumber(slideNumber + 1)
  }

  const handleChange = (e) =>{
    setDescription(e.target.value);
  }

  const createMarkup = (htmlString) => {
    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(htmlString, 'text/html');
    return { __html: parsedHTML.body.innerHTML };
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    
    setPostImage([...postImage, base64]);
    
  };

  const removeImage = (index) => {
    setPostImage(prevState => prevState.filter((_, i) => i !== index));
  };

  const saveDiary = () => {
      if(description.length<30){
        props.showAlert("Description should be min of 30 characters", "danger"); return;
      }
      updateDiary(description, postImage, choosendate);
      props.showAlert("Diary Updated Successfully", "success");
      setState('A');
  };

  

  return (
    <>
    
      <div className='p-4' style={{backgroundImage: `url(${img})`, minHeight: "100vh"}}>
        <div className='d-flex justify-content-between align-items-center'>
          <p style={{textAlign:"center",fontSize:"2.5rem",color:"#561734"}}>Diary</p> 
          {(today == choosendate && state=="A")&&<button className='btn text-white' style={{height: "fit-content", backgroundColor: "#5a1734"}} onClick={()=>{setState("E"); setDescription((diary)?diary.description:null); setPostImage((diary)?diary.image:[])}}>Edit</button>}
          {/* {(today===choosendate && state=="E")&&<button className='btn text-white' style={{height: "fit-content", backgroundColor: "#5a1734"}} onClick={saveDiary}>Save</button>} */}
        </div>

        <div className="textboxtitle" style={{position: "unset"}}>
          <span><p >{choosendate}</p></span>
        </div>

        <div className='row mt-5'>
          
          {(state=='A' && diary)?<div className='col-8'>{(diary.description) && <div className="" dangerouslySetInnerHTML={{ __html: diary.description }} />}

          {openModal && 
            <div className='sliderWrap'>
              <FontAwesomeIcon icon={faCircleXmark} className='btnClose' onClick={handleCloseModal}  />
              <FontAwesomeIcon icon={faCircleChevronLeft} className='btnPrev' onClick={prevSlide} />
              <FontAwesomeIcon icon={faCircleChevronRight} className='btnNext' onClick={nextSlide} />
              <div className='fullScreenImage'>
                <img src={diary.image[slideNumber]} alt='' />
              </div>
            </div>
          }

          </div> : (state=='A')&&<div className='col-8 d-flex justify-content-center align-items-center'>
              <p style={{fontSize: "1.7rem"}}>Nothing Written</p>
          </div>
          }

          {(state=="E") && 

          <div className='col-8'>
            <div className='card'>
                <div className='card-body'>
                  <div className='mb-3'>
                    <label className="form-label">Description</label>
                    <textarea className='form-control' rows={10} name='description' onChange={handleChange} value = {description} />
                  </div>
                  <div className='mb-3'>
                    <label className="form-label">Upload Images</label>
                    <input type="file" label="Image" name="myFile" id="image-upload" accept=".jpeg, .png, .jpg" className="form-control" onChange={(e) => handleImageUpload(e)} />
                  </div>

                  {postImage.length!==0&&<div className="mb-3">
                    <label className="form-label">Uploaded Images</label>
                    <div className="row">
                    {postImage.map((img, index) => (
                          <div className="col-3" key={index}>
                              <div className="btn text-white py-1 px-2" style={{backgroundColor: "#5a1734"}} onClick={() => removeImage(index)}><i class="las la-backspace fs-2"></i></div>
                              <img src={img} alt="Stored Image" style={{ width: "150px" }} />
                          </div>
                      ))}
                    </div></div>}

                  <div className='mb-3 text-end'>
                    <button className='btn text-white' style={{backgroundColor: "#561734"}} onClick={saveDiary}>Save</button>
                  </div>

                </div>
            </div>
          </div>

          }

          <div className='col-4 ms-auto'>
            <div className="card my-3 ms-auto" style={{width: "fit-content", backgroundColor: "#e3e2df"}}>
              <DayPicker selected={selectedDate} onDayClick={handleDateChange} />
              {/* {selectedDate && <p>Selected date: {selectedDate.toLocaleDateString('en-GB')}</p>} */}
            </div>
          </div>

          {(state=='A')&&<div className='col-12 galleryWrap' style={{position: "unset"}}>
            {(diary!=null)&&(diary.image.length>0) && diary.image.map((img, index) => {
                return(
                  <div 
                    className='single' 
                    key={index}
                    onClick={ () => handleOpenModal(index) }
                  >
                    <img src={img} alt='Error Loading Image' />
                  </div>
                )
              })
            }
          </div>}

        </div>
      </div>
   
    </>
  )
}

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

export default ViewDiary