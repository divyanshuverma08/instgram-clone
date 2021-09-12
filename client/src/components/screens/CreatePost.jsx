import React, { useState , useEffect } from 'react';
import M from "materialize-css";
import { useHistory} from 'react-router';
require('dotenv').config();
export default function CreatePost() {
  
  const [post,setPost] = useState({
      title:"",
      body:"",
  });  
  const [image,setImage] =useState("");
  const [url,setUrl] = useState("");
  const history = useHistory();
   
  useEffect(() => {
      if(url){
    fetch("/createpost",{
          method:"post",
          headers:{
              "Content-Type":"application/json",
              "authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
              title:post.title,
              body:post.body,
              imgUrl:url
          })
      }).then(res=>res.json())
      .then(data=>{
          if(data.error){
              M.toast({html: data.error})
          }
          else{
              M.toast({html: data.message})
              history.push("/");
          }
      }).catch(err=>{
          console.log(err);
      });
    }
  }, [url]); 

  function handleSubmit(){
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
            setUrl(data.url);    
      })
      .catch(err=>{
          console.log(err);
      }); 
   }

  function handleChange(event){
    const {name,value} = event.target;

    setPost(prevValue=>{
            return {...prevValue,[name]:value}
    });
  }

    return (
        <div className="card input-field card-post">
            <input onChange={handleChange} value={post.title} name="title" type="text" placeholder="title"/>
            <input onChange={handleChange}  value={post.body} name="body" type="text" placeholder="content"/>
            <div className="file-field input-field">
            <div className="btn waves-effect waves-light #1565c0 blue darken-3">
                <span>Uplaod Image</span>
                <input type="file" onChange={(e)=>{setImage(e.target.files[0]);}} name="image"/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            <button onClick={handleSubmit} className="btn waves-effect waves-light #1565c0 blue darken-3">Submit</button>
        </div>
    )
}
