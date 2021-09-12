import React , {useState} from "react";
 
function Popup(props){
    const [post,setPost] = useState({
        title:"",
        body:"",
    });  

    function handleChange(event){
        const {name,value} = event.target;
    
        setPost(prevValue=>{
                return {...prevValue,[name]:value}
        });
      }
  return (
    <div className="popup-box">
      <div className="box">
      <span className="close-icon" onClick={props.handleClose}><i className="material-icons">close</i></span>
      <img src={props.pic} style={{maxWidth:"100%", maxHeight:"100%"}} alt="" />  
      <div className="card input-field card-post">
            <input onChange={handleChange} value={post.title} name="title" type="text" placeholder="title" />
            <input onChange={handleChange}  value={post.body} name="body" type="text" placeholder="content"/>
            <button onClick={()=>{props.handleSubmit(post)}} className="btn waves-effect waves-light #1565c0 blue darken-3">Submit</button>
        </div>
      </div>
    </div>
  );
};
 
export default Popup;