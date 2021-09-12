import React, { useState , useEffect ,useContext} from 'react';
import {userContext} from "../../App";
import {Link} from "react-router-dom";
import Popup from './Popup';
import M from "materialize-css";

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [data,setData] = useState([]);
    const {state} = useContext(userContext);
    const [postId,setPostId] = useState("");
    useEffect(() => {
        fetch("/allpost",{
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

    function togglePopup(item){
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
                    const newData = data.map(item=>{
                        if(item._id===result.post._id){
                            return result.post;
                        }else{
                            return item;
                        }
                    });
                    setData(newData);
                    M.toast({html: result.message , classes:"#1de9b6 teal accent-3"})
                }
            }).catch(err=>{
                console.log(err);
            });
               setIsOpen(!isOpen);  
        }   
    }  

    return (
        <div className="home">
        {
            data.map((item,index)=>{
              return(
                <div className="card home-card" key={index}>
                <img style={{float:"left" , maxWidth:"55px" , margin:"10px" , borderRadius:"50%"}} src={item.postedBy.pic} alt="profile-pic" />
               <h5 style={{padding:"20px"}}><Link to={ item.postedBy._id!==state._id ? "/profile/" + item.postedBy._id : "/profile"} >{item.postedBy.name}</Link >
               {item.postedBy._id===state._id && <><i onClick={()=>{deletePost(item._id)}} className="material-icons" style={{float:"right"}}>delete</i>
               <i onClick={()=>{togglePopup(item._id)}} style={{float:"right" ,  marginRight:"10px"}} className="material-icons">edit</i></>}
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
               <div>
               {isOpen && (<Popup handleClose={togglePopup} handleSubmit={updatePost} />)}</div>
            </div>
              )
            })
        }
            
        </div>
    );
}
