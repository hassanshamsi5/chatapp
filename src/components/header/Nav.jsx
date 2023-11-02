import axios from 'axios';
import React , { useContext } from 'react';
import { GlobalContext } from "../../context/context";
import { Link } from "react-router-dom";

const Header = () => {

    const baseUrl = 'http://localhost:3002'

    const { state, dispatch } = useContext(GlobalContext);

    const logOutHandler = async () => {

        const resp = await axios.post(`${baseUrl}/api/v1/logout`, {}, {
            withCredentials: true
        })
        dispatch({
            type: "USER_LOGOUT"
          });
        console.log(resp.message)

    }

    return (
        <header className="bg-[#070724] sticky top-0">
            <nav className="container mx-auto flex justify-between items-center w-[92%] min-w-fit">
                <div className="flex z-50 bg-[#070724] justify-center h-16 tracking-[1em] items-center">
                    <h1 className="text-center align-middle text-white font-bold">MSTECH</h1>
                    <img className="h-11 w-12 sm:w-11 hidden md:block rounded-full"
                        src="../img/ben-sweet-2LowviVHZ-E-unsplash.jpg"
                        alt="Pfp not found" id="userNavProfImg" />
                </div>
                <div id="navList"
                    className="flex z-[-1] md:z-0 bg-[#070724] flex-col  md:items-center absolute md:w-auto top-0 invisible md:visible -translate-y-full md:-translate-y-0 left-0 md:top-auto md:left-auto duration-500 md:duration-0 w-full md:h-fit md:static">
                    <ul className="flex p-5   justify-start gap-8 flex-col md:flex-row md:justify-evenly text-white">
                        <li><Link to={`/`}>Home</Link></li>
                        <li><Link to={`/profile`}>Profile</Link></li>
                        <li><Link to={`/about`}>About</Link></li>
                        <li><Link to={`/chat`}>ChatRoom</Link></li>
                        <li><Link to={`/signup`}>Signup</Link></li>
                    </ul>
                </div>
                <div className="flex z-50 items-center gap-2">
                    <Link to={`/login`}>
                        <button onClick={logOutHandler} className="bg-blue-600 rounded-2xl p-2 text-sm outline-none text-white font-semibold">Log
                            Out</button>
                    </Link>
                    <div className="sm:hidden">
                        <i id="bar" className="fa-solid fa-bars text-white"></i>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
