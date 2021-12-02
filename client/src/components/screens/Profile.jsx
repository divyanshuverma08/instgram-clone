import React , {useEffect, useState , useContext} from 'react';
import {userContext} from "../../App";
import Popup from './Popup';
import M from "materialize-css";
require('dotenv').config();

export default function Profile() {
  const {state ,dispatch} = useContext(userContext);
  //const state= JSON.parse(localStorage.getItem("user")); 
  const [image,setImage] = useState("");
  const [mypics,setPics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [postId,setPostId] = useState("");
  const [photo,setPhoto] = useState("");
  useEffect(() => {
    fetch("/mypost",{
      headers:{
        "authorization":"Bearer " + localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(res=>{
        setPics(res.posts);
    })
    .catch(err=>{
      console.log(err);
    });
  }, []);

  useEffect(() => {
    if(image){
      const data = new FormData();
      data.append("file",image);
      data.append("upload_preset","insta-clone");
      data.append("cloud_name","divyanshu08");
      fetch(process.env.REACT_APP_CLOUD_API,{
          method:"post",
          body: data
      })
      .then(res=>res.json())
      .then(data=>{
            fetch("/updatepic",{
              method:"put",
              headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                pic:data.url
              })
            })
            .then(res=>res.json())
              .then(result=>{
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
            dispatch({type:"UPDATEPIC",payload:result.pic});
              })
              .catch(err=>{
                console.log(err);
              })
      })
      .catch(err=>{
          console.log(err);
      }); 

    }
  }, [image])

  function togglePopup(item,pic){
    setPhoto(pic);
    setPostId(item);
    setIsOpen(!isOpen);   
  }

  function updatePost(post){
    if(post.title===""){
        M.toast({html:"Title cannot be empty" , classes:"#c62828 red darken-3"})
    }else{
        fetch("/updatepost/" + postId,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title:post.title,
                body:post.body
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html: result.error , classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: result.message , classes:"#1de9b6 teal accent-3"})
            }
        }).catch(err=>{
            console.log(err);
        });
           setIsOpen(!isOpen);  
    }   
}

  function updatePhoto(file){
    setImage(file);
  }

    return (
      <>
       {state ?
        <div className="main">
          <div className="main-grid">
             <div className="profile-pic">
              <img style={{width:"150px",height:"150px",borderRadius:"80px" , marginLeft:"20%"}} alt="profile-pic"
               src={state.pic ? state.pic : "https://res.cloudinary.com/divyanshu08/image/upload/v1631127004/dummy-image_guweo7.jpg"} />
             </div>            
            <div className="upload">
                <label htmlFor="files" className="btn black darken-3">Select Image</label>
                <input id="files" style={{visibility:"hidden"}}type="file" onChange={(e)=>{updatePhoto(e.target.files[0]);}} name="image" placeholder="upload" />                        
             </div>                 
             <div className="profile-content">
               <h4>{state.name}</h4>
               <div className="profile-stats">
                   <h6>{mypics.length} posts</h6>
                   <h6>{state.followers.length} followers</h6>
                   <h6>{state.following.length} following</h6>
               </div>
             </div>
          </div>
          <hr style={{borderTop:"1px solid grey" , width:"55%" ,  position:"relative" , bottom:"30px"}} />
          <div className="gallery">
          {
            mypics.map(item =>{
             return  <img onClick={()=>{togglePopup(item._id,item.photo)}} key={item._id} className="item" src={item.photo} alt={item.title}/>
                         
            })
          }
          </div>
          {isOpen && (<Popup pic={photo} handleClose={togglePopup} handleSubmit={updatePost} />)}
          <> </>
        </div> : <h2>Loading...</h2> }
        </>
    )
}
