import React, { useContext , useRef , useEffect ,useState } from 'react';
import {Link , useHistory} from "react-router-dom";
import {userContext} from "../App";
import M from "materialize-css"

export default function Navbar() {
  const searchModal = useRef(null);
  const [search,setSearch] = useState("");
  const [userDetails,setUserDetails] = useState([]);
  const {state , dispatch} = useContext(userContext);
  const history = useHistory(); 
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = ()=>{
    if(state){
        return(
          <>
          <li><i data-target="modal1" className="material-icons modal-trigger" style={{color:"white"}}>search</i></li>
          <li><Link to="/createpost">Post</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/myfollowingpost">MyFollowing</Link></li>
          <li><button onClick={()=>{
            localStorage.clear();
            dispatch({type:"CLEAR"});
            history.push("/signin");
          }} 
          className="btn #1565c0 black darken-3" >Logout</button></li>
          </>
        ) 
    }else{
      return(
        <>
        <li><Link to="/signin">Signin</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        </>
      )
    }
  }

  function fetchUsers(query){
    setSearch(query);
    fetch("/search-users",{
      method:"post",
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        query:query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user);
    })
  }


    return (         
  <nav>
    <div className="nav-wrapper white">
      <Link to={state ? ("/") : ("/signin")} className="brand-logo left">Photobag</Link>
      <ul className="right ">
      {renderList()}
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
      <div className="modal-content">
        <input
        type="text"
        placeholder="search"
        value={search}
        onChange={(e)=>{fetchUsers(e.target.value)}}
         />  
          <ul className="collection">
          {userDetails.map(item=>{ 
            return  state._id!==item._id && (<Link key={item._id} to={"/profile/"+item._id} onClick={
              ()=>{M.Modal.getInstance(searchModal.current).close()}
            }
            ><li style={{width:"100%"}} className="collection-item">{item.email}</li></Link>)
          })}
           </ul>                
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch("")}}>Close</button>
      </div>
    </div>
  </nav>
    );
}


