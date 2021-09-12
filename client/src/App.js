import React, { createContext, useContext, useEffect, useReducer } from "react";
import NavBar from "./components/navbar"
import "./App.css"
import {BrowserRouter,Route , Switch , useHistory} from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import Signin from "./components/screens/Signin";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribeUserPost from "./components/screens/SubscribeUserPost";
import {reducer, initialstate }  from "./reducers/userReducer";
import Reset from "./components/screens/Reset";
import Newpassword from "./components/screens/Newpassword";

export const userContext = createContext();

function Routing(){
  const history = useHistory();
  const {dispatch} = useContext(userContext);
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user")); 
    if(user){
      dispatch({type:"USER",payload:user});
    }else{
      if(!history.location.pathname.startsWith("/reset"))
          history.push("/signin");
    }
  },[]);

  return(
    <Switch>
    <Route exact path="/">
    <Home /> 
  </Route>
  <Route path="/signin">
    <Signin /> 
  </Route>
  <Route path="/signup">
    <Signup /> 
  </Route>
  <Route exact path="/profile">
    <Profile /> 
  </Route>
  <Route path="/createpost">
    <CreatePost /> 
  </Route>
  <Route path="/profile/:userid">
    <UserProfile /> 
  </Route>
  <Route path="/myfollowingpost">
    <SubscribeUserPost />
  </Route>
  <Route exact path="/reset">
    <Reset />
  </Route>
  <Route path="/reset/:token">
    <Newpassword />
  </Route>
  </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialstate);

  return (
    <userContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <NavBar />
    <Routing />
    </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
