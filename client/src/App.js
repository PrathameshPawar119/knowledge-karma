
import React, { useEffect, useState } from 'react';
import './App.css';
import authService from './features/auth/authService';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './features/auth/authSlice';
import Navbar from './components/Navbar/Navbar';
import Marketplace from './pages/Marketplace';
import Home from './pages/Home';
import CommunityTab from './pages/CommunityTab';
import Contributors from './pages/Contributors';
import Auth from './components/Auth/Auth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Profile from './pages/Profile';



function App() {
  const [currentTab, setCurrentTab] = useState('marketplace')

  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {

    const checkSession = async () => {
      if (!user) {
        const userData = await authService.verifyUser();
        console.log(userData.success)

        if (userData.success) {
          dispatch(setUser(userData.data))
        } else {
          console.log("User session expired")
        }
      }
    }

    checkSession()

    return () => {

    }
  }, [])



  const onClick = async () => {
    console.log(user)
    const data = {
      name: "John",
      email: "johndoe@gmail.com",
      password: "johndoe"
    }


    // const userData = await authService.registerUser(data);
    const userData = await authService.verifyUser();

    // console.log(userData)

    // dispatch(setUser(userData.data))
  }

  return (
    <div className="App">
      {/* <button onClick={onClick}>Click Me</button> */}
      <Router>
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <Routes>
          <Route path='/auth' element={<Auth />}>
            <Route index={true} element={<Login />} />
            <Route path='signup' element={<SignUp />} />
          </Route>
          <Route path='/' element={<Home />} >
            <Route path='community' element={<CommunityTab />} />
            <Route path='contributers' element={<Contributors />} />
            <Route path='marketplace' element={<Marketplace />} />
          </Route>
          <Route path='/profile/:id' element={<Profile />} >
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
