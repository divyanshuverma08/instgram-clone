import React , {useEffect, useState , useContext} from 'react';
import {userContext} from "../../App";
import {useParams} from "react-router-dom";
import ProfileLoader from "../loader/profileLoader";
export default function UserProfile() {
  const {state,dispatch} = useContext(userContext);
  //const state= JSON.parse(localStorage.getItem("user")); 
  const [userProfile,setProfile] = useState(null);
  const {userid} = useParams();
  useEffect(() => {
    fetch("/user/" + userid,{
      headers:{
        "authorization":"Bearer " + localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(res=>{
        setProfile(res);
    })
    .catch(err=>{
      console.log(err);
    });
  }, []);

  function followUser(){
    fetch("/follow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "authorization":"Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userid
      })
    }).then(res=>res.json())
    .then(data=>{
      dispatch({type:"UPDATE",payload:{following:data.currentUser.following,followers:data.currentUser.followers}});
      localStorage.setItem("user",JSON.stringify(data.currentUser));
      setProfile(prevValue=>{
        return {...prevValue,user:data.followUser}
      });
    })
  }

  function unFollowUser(){
    fetch("/unfollow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "authorization":"Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        unfollowId:userid
      })
    }).then(res=>res.json())
    .then(data=>{
      console.log(data.currentUser);
      dispatch({type:"UPDATE",payload:{following:data.currentUser.following,followers:data.currentUser.followers}});
      localStorage.setItem("user",JSON.stringify(data.currentUser));
      setProfile(prevValue=>{
        return {...prevValue,user:data.unfollowUser}
      });
    })
  }
    return (
        <>
        {userProfile ? 
           <>
          <div className="main">
          <div className="main-grid">
             <div className="profile-pic">
              <img style={{width:"150px",height:"150px",borderRadius:"80px" , marginRight:"30%" }} alt="profile-pic"
               src={userProfile.user.pic} />
             </div>
             <div style={{marginLeft:"2%"}} className="profile-content">
               <h4>{userProfile.user.name}</h4>
               <h4>{userProfile.user.email}</h4>
               <div className="profile-stats">
                   <h6>{userProfile.posts.length} posts</h6>
                   <h6>{userProfile.user.followers.length} followers</h6>
                   <h6>{userProfile.user.following.length} following</h6>
               </div>
             </div>
             {userProfile.user.followers.includes(state._id) ? 
                <button style={{margin:"10px" ,  gridColumn:"2/3" , width:"50%"}} onClick={unFollowUser} className="btn waves-effect waves-light black darken-3">Unfollow</button>
                : 
                <button style={{margin:"10px" ,  gridColumn:"2/3" , width:"50%"}} onClick={followUser} className="btn waves-effect waves-light black darken-3">Follow</button>
               }
          </div>
          <hr style={{borderTop:"1px solid grey" , width:"55%" ,  position:"relative" , bottom:"30px"}} />
          <div className="gallery">
          {
            userProfile.posts.map(item =>{
             return <img key={item._id} className="item" src={item.photo} alt={item.title}/>
            })
          }
          </div>
        </div> 
        </>
        :
         <ProfileLoader/>}
        
        </>
    )
}
