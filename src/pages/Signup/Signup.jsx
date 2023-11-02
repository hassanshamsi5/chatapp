import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import { baseUrl } from '../../core';

const Signup = () => {


    const firstNamRef = useRef(null);
    const lastNamRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);


    const submitSignupFormHandler = async (e) => {
        e.preventDefault()
        // /api/v1  // /signup
        try {
            const response = await axios.post(`${baseUrl}/api/v1/signup`, {
                firstName: firstNamRef.current.value,
                lastName: lastNamRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
            });
            console.log(response)
            // Update the state to include the new post
            const Message = response.data
          
        } catch (error) {
            console.error("Error adding new post: ", error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">First Name</label>
                        <input ref={firstNamRef} type="text" id="name" name="Firstname" className="w-full p-3 border rounded focus:outline-none focus:border-blue-500" placeholder="John" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Last Name</label>
                        <input ref={lastNamRef} type="text" id="name" name="Lastname" className="w-full p-3 border rounded focus:outline-none focus:border-blue-500" placeholder="Doe" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                        <input ref={emailRef} type="email" id="email" name="email" className="w-full p-3 border rounded focus:outline-none focus:border-blue-500" placeholder="johndoe@example.com" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                        <input ref={passwordRef} type="password" id="password" name="password" className="w-full p-3 border rounded focus:outline-none focus:border-blue-500" placeholder="********" required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={submitSignupFormHandler} type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded focus:outline-none focus:shadow-outline">Sign Up</button>
                    </div>
                </form>
                <div className="mt-6">
                    <p className="text-sm text-gray-600">Already have an account? <Link to={`/login`} className="text-blue-500 hover:text-blue-600 font-semibold">Log In</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
