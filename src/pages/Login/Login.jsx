import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import { GlobalContext } from '../../context/context';
import { useContext } from "react";
import { baseUrl } from '../../core';

const Login = () => {

    let { state, dispatch } = useContext(GlobalContext);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);


    const submitLoginFormHandler = async (e) => {
        e.preventDefault()
        // /api/v1  // /signup
        try {
            const response = await axios.post(`${baseUrl}/api/v1/signin`, {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            }, {
                withCredentials: true,
            });
            console.log(response)
            // Update the state to include the new post
            dispatch({
                type: "USER_LOGIN",
                payload: response.data.data
            })

            const Message = response.data

        } catch (error) {
            console.error("Error adding new post: ", error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-6">Log In</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                        <input ref={emailRef} type="email" id="email" name="email" className="w-full p-3 border rounded focus:outline-none focus:border-blue-500" placeholder="johndoe@example.com" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                        <input ref={passwordRef} type="password" id="password" name="password" className="w-full p-3 border rounded focus:outline-none focus:border-blue-500" placeholder="********" required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={submitLoginFormHandler} type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded focus:outline-none focus:shadow-outline">Log In</button>
                    </div>
                </form>
                <div className="mt-6">
                    <p className="text-sm text-gray-600">Create a new account ! <Link to={`/signup`} className="text-blue-500 hover:text-blue-600 font-semibold">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
