import React, {useState , useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import M from "materialize-css";
require('dotenv').config();

export default function Signup() {
  const [image,setImage] = useState("");
  const [url,setUrl] = useState(undefined);
  const [user,setUser] = useState({
    name:"",
    email:"",
    password:""
  });
  const history = useHistory();
  useEffect(() => {
    if(url){
      uploadFields();
    }
  }, [url]);

  function uploadPic(){
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


  function uploadFields(){
    const {name,email,password} =user;
    const options = {
      headers: {'Content-Type': 'application/json'}
    };
    axios.post("/signup",{name,email,password,pic:url},options) 
    .then(res=>{
      console.log(res.data.message); 
      M.toast({html: res.data.message, classes:"#1de9b6 teal accent-3"})
      if(res.data.success){
        history.push("/signin");
      }
    })
    .catch(err=>{
      if (err.response) {
        M.toast({html: err.response.data.error, classes:"#c62828 red darken-3"});
        console.log(err.response.status);
      }
    });
  }

  function handleClick(){
    if(image){
      uploadPic();
    }else{
      uploadFields();  
    }
  }

  function handleChange(event){
       const {name,value} = event.target;
       setUser(prevValue=>{
         return {...prevValue,[name]:value};
       });
  }

    return (
        <div className="my-card">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          <input onChange={handleChange} value={user.name} name="name" type="text" placeholder="name"/>
          <input onChange={handleChange} value={user.email} name="email" type="email" placeholder="email"/>
          <input onChange={handleChange} value={user.password} name="password" type="password" placeholder="password"/>
          <div className="file-field input-field">
            <div className="btn waves-effect waves-light #1565c0 blue darken-3">
                <span>Uplaod pic</span>
                <input type="file" onChange={(e)=>{setImage(e.target.files[0]);}} name="image"/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
          <button onClick={handleClick} className="btn waves-effect waves-light #1565c0 blue darken-3">Sign Up</button>
          <h5><Link to="/signup">Already have an account ?</Link></h5>
    </div>
  </div>
    )
}
