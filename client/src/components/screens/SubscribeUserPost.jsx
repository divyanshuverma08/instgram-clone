import React, { useState , useEffect ,useContext} from 'react';
import {userContext} from "../../App";
import {Link} from "react-router-dom";

export default function SubscribeUserPost() {
    const [data,setData] = useState([]);
    const {state} = useContext(userContext);
    useEffect(() => {
        fetch("/getsubpost",{
        headers:{
            "authorization":"Bearer " + localStorage.getItem("jwt")
         }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts);
        })
        .catch(err=>{
            console.log(err);
        })
        
    }, []);
    const likePost = (id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(res=>{
            const newData = data.map(item=>{ // updating the state and changing a item in array
                if(item._id===res._id){
                    return res;
                }else{
                    return item;
                }
             });
             setData(newData);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const unLikePost = (id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(res=>{
            const newData = data.map(item=>{
               if(item._id===res._id){
                   return res;
               }else{
                   return item;
               }
            });
            setData(newData);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    function makeComment(text,postId){
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text,
                postId
            })
        }).then(res=>res.json())
        .then(res=>{
            const newData = data.map(item=>{
                if(item._id===res._id){
                    return res;
                }else{
                    return item;
                }
            });
            setData(newData);
        })
        .catch(err=>{
            console.log(err);
        });
    }

    function deletePost(postId){
        fetch("/delete/post/" + postId,{
            method:"delete",
            headers:{
                "authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(res=>{
            const newData = data.filter(item=>{
                return item._id!== res._id
            });
            setData(newData);
        }).catch(err=>{
            console.log(err);
        });      
        
    }

   
    function deleteComment(postId,id){
        fetch("/delete/comment/" + postId,{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
               id
            })
        }).then(res=>res.json())
        .then(res=>{
            const newData = data.map(item=>{
                if(item._id===res._id){
                    return res;
                }else{
                    return item;
                }
            });
            setData(newData);
        }).catch(err=>{
            console.log(err);
        });      
        
    }

    return (
        <div className="home">
        {
            data.map((item,index)=>{
              return(
                <div className="card home-card" key={index}>
                <img style={{float:"left" , maxWidth:"55px" , margin:"10px" , borderRadius:"50%"}} src={item.postedBy.pic} alt="profile-pic" />
               <h5 style={{padding:"20px"}}><Link to={ item.postedBy._id!==state._id ? "/profile/" + item.postedBy._id : "/profile"} >{item.postedBy.name}</Link >
               {item.postedBy._id===state._id && <i onClick={()=>{deletePost(item._id)}} className="material-icons" style={{float:"right"}}>delete</i>}
               </h5>
               <div className="card-img">
                   <img src={item.photo} style={{maxWidth:"100%", maxHeight:"100%"}} alt="" />
               </div>
               <div className="card-content">
                <i className="material-icons" style={{color:"red"}} >favorite</i>
                {
                    item.likes.includes(state._id)
                    ?
                    <i onClick={()=>unLikePost(item._id)} className="material-icons">thumb_down</i>
                    :
                    <i onClick={()=>likePost(item._id)} className="material-icons">thumb_up</i>
                }                
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {
                    item.comments.map(record=>{
                        return(
                            <h6 style={{cursor:"pointer"}} key={record._id} >
                            <Link to={ record.postedBy._id!==state._id ? "/profile/" + record.postedBy._id : "/profile"} style={{fontWeight:"500"}}>{record.postedBy.name}</Link> {record.text}
                            {record.postedBy._id===state._id && <i onClick={()=>{deleteComment(item._id,record._id)}} className="material-icons" style={{float:"right"}}>delete_forever</i>}</h6>
                        )
                    })
                }
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    makeComment(e.target[0].value,item._id);      
                    e.target[0].value="";  
                }}>
                <input type="text" placeholder="add a comment" />
                </form>
               </div>
            </div>
              )
            })
        }
            
        </div>
    );
}
