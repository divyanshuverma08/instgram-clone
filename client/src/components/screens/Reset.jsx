import React, {useState , useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import M from "materialize-css";

export default function Reset() {
  const [user,setUser] = useState({
    email:""
  });
  const history = useHistory();
  const options = {
    headers: {'Content-Type': 'application/json'}
  };

  function handleClick(){
    axios.post("/reset-password",user,options) 
    .then(res=>{
      console.log(res.data.message);
     M.toast({html: res.data.message, classes:"#1de9b6 teal accent-3"});
      history.push("/signin");
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
              <h2>Instagram</h2>
              <input  onChange={handleChange} value={user.email} name="email" type="email" placeholder="email"/>
              <button onClick={handleClick} className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit" name="action">Reset password</button>
              <h5><Link to="/signup">Create Account ?</Link></h5>
        </div>
      </div>
    )
}
