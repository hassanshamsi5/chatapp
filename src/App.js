import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/header/Nav";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import { GlobalContext } from "./context/context";
import { useEffect, useContext } from "react";
import { baseUrl } from "./core";
import axios from "axios";

function App() {
  // const location = useLocation();

  // const showHeader = () => {
  //   const excludedRoutes = ['/login', '/signup'];
  //   // console.log(location.pathname)
  //   return !excludedRoutes.includes(location.pathname);
  // };

  let { state, dispatch } = useContext(GlobalContext);

  // dispatch({
  //     type: "USER_LOGIN",
  //   })

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const resp = await axios.get(`${baseUrl}/api/v1/profile`, {
          withCredentials: true,
        });
        dispatch({
          type: "USER_LOGIN",
          payload: resp.data.data,
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: "USER_LOGOUT",
        });
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <>
      {/* admin routes */}
      {state.isLogin === true && state.role === "admin" ? (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<About />} />
            <Route path="chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null}
      {/* user routes */}
      {state.isLogin === true && state.role === "user" ? (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<About />} />
            <Route path="chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null}
      {/* unauthorized routes */}
      {state.isLogin === false ? (
        <>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" replace={true} />} />
          </Routes>
        </>
      ) : null}
      {/* splashscreen routes */}
      {state.isLogin === null ? (
        <>
          <div>Loading</div>
        </>
      ) : null}
    </>
  );
}

export default App;
{
  /* <Routes>

<Route path="/" element={<Home />} />
<Route path="profile" element={<Profile />} />
<Route path="about" element={<About />} />
<Route path="chat" element={<Chat />} />
<Route path="login" element={<Login />} />
<Route path="signup" element={<Signup />} />
<Route path="*" element={<Navigate to="/" replace={true} />} />
</Routes> */
}
