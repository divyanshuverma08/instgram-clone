import React, {useState , useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import M from "materialize-css";
import {userContext} from "../../App"

export default function Signin() {
  const {dispatch} = useContext(userContext);

  const [user,setUser] = useState({
    email:"",
    password:""
  });
  const history = useHistory();
  const options = {
    headers: {'Content-Type': 'application/json'}
  };

  function handleClick(){
    axios.post("/signin",user,options) 
    .then(res=>{
      localStorage.setItem("jwt",res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.user));
      dispatch({type:"USER",payload:res.data.user});
      M.toast({html: res.data.message, classes:"#1de9b6 teal accent-3"})
      if(res.data.success){
        history.push("/profile");
      }
    })
    .catch(err=>{
      if (err.response) {
        M.toast({html: err.response.data.error, classes:"#c62828 red darken-3"});
        console.log(err.response.status);
      }
    });
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
              <h2>Photobag</h2>
              <input  onChange={handleChange} value={user.email} name="email" type="email" placeholder="email"/>
              <input  onChange={handleChange} value={user.password} name="password" type="password" placeholder="password"/>
              <button onClick={handleClick} className="btn waves-effect waves-light black darken-3" type="submit" name="action">Sigin</button>
              <h5><Link to="/signup">Create Account ?</Link></h5>
              <h5><Link to="/reset">Reset Password</Link></h5>
        </div>
      </div>
    )
}
