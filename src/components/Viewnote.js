import {React,useState ,createRef, useContext, useEffect } from 'react'
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCircleChevronLeft, 
  faCircleChevronRight, 
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons'
import './Viewnote.css'
// import './Viewimage.css'
import img from './timg3.jpg'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import noteContext from '../context/notes/noteContext'; 
    
const Viewnote = () => {

  const [slideNumber, setSlideNumber] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const[openPhotos,setOpenPhotos]=useState(true);
  
  const params = useParams();
  const context = useContext(noteContext);
  const { noteItem, getNotebyId} = context;
  const navigate = useNavigate();

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotebyId(params.noteid);
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
    ? setSlideNumber( noteItem.image.length -1 ) 
    : setSlideNumber( slideNumber - 1 )
  }

  // Next Image  
  const nextSlide = () => {
    slideNumber + 1 === noteItem.image.length ? setSlideNumber(0) : setSlideNumber(slideNumber + 1)
  }

  const createMarkup = (htmlString) => {
    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(htmlString, 'text/html');
    return { __html: parsedHTML.body.innerHTML };
  };

  return (
    <>
    <div className='p-4' style={{backgroundImage: `url(${img})`, minHeight: "100vh"}}>
        <br />
    <div className='row'>
      <div className='col-6'>
      <div>
          <p style={{textAlign:"left",fontSize:"2.5rem",color:"#561734"}}> {(noteItem===null)?'':noteItem.title}</p> 
        </div>
      </div>
      <div className='col-6'>
      <div className="" style={{textAlign:"right",fontSize:"1rem",color:"#561734"}}>
          Date: <b>{(noteItem && noteItem.description) && noteItem.date}</b>
          <br></br>
          Tag: <b>{(noteItem===null)?'':noteItem.tag}</b>
      </div>
    </div>
    </div>
    
      {/* <div className='p-4' style={{backgroundImage: `url(${img})`, minHeight: "100vh"}}>
        <br /> */}
        
        {/* <div>
          <p style={{textAlign:"left",fontSize:"2.5rem",color:"#561734"}}> {(noteItem===null)?'':noteItem.title}</p> 
        </div> */}
      
        {/* <div className="" style={{textAlign:"right",fontSize:"1.5rem",color:"#561734"}}>
          {(noteItem && noteItem.description) && noteItem.date}
          
        </div> */}
        <br />
        <br />
    
        {/* <div class="card bg-light">
    <div class="card-body text-center">
      <p class="card-text">{(noteItem && noteItem.description) && <div className="textbox" dangerouslySetInnerHTML={{ __html: noteItem.description }} />}</p>
    </div>
  </div> */}
       {/* {(noteItem && noteItem.description) && <div className="textbox" dangerouslySetInnerHTML={{ __html: noteItem.description }} />} */}
       
      <div className='row'>
        <div className='col-7'>
        <div class="card" style={{borderRadius:"10px", backgroundColor:"#efdfdd"} }>
    <div class="card-body text-center">
      <p class="card-text">{(noteItem && noteItem.description) && <div  dangerouslySetInnerHTML={{ __html: noteItem.description }} />}</p>
    </div>
  </div>
        {/* {(noteItem && noteItem.description) && <div className="textbox" dangerouslySetInnerHTML={{ __html: noteItem.description }} />} */}
        </div>

      

      {openModal && 
        <div className='sliderWrap'>
          <FontAwesomeIcon icon={faCircleXmark} className='btnClose' onClick={handleCloseModal}  />
          <FontAwesomeIcon icon={faCircleChevronLeft} className='btnPrev' onClick={prevSlide} />
          <FontAwesomeIcon icon={faCircleChevronRight} className='btnNext' onClick={nextSlide} />
          <div className='fullScreenImage'>
            <img src={noteItem.image[slideNumber]} alt='' />
          </div>
        </div>
      }

      <div className='galleryWrap col-5'>
      {openPhotos&& <div className='row'>
        {
          
          (noteItem!=null)&&(noteItem.image.length>0) && noteItem.image.map((img, index) => {
            return(
              <div 
                className='col-6 my-1 p-1' 
                key={index}
                onClick={ () => handleOpenModal(index) }
              >
              <img src={img} style={{width: "10rem", height:"7rem", objectFit: "cover"}} alt='Error Loading Image' />
              </div>
            )
          })
        }
      </div>}
      </div>
      </div>
      </div>
   
    </>
  )
}

export default Viewnote