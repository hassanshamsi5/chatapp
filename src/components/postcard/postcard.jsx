
import { useState, useRef, useEffect } from "react";
import { FaMarker, FaTrashCan } from "react-icons/fa6";
import Modal from '../modal/modal'
import axios from "axios";

const Postcard = ({ postDetails, verifydelPost, inpeditPost }) => {

  // const postidUpdateRef = useRef(null);
  // const postidDeletesRef = useRef(null);

  //  postidUpdateRef = postDetails?.id
  //  postidDeletesRef = postDetails?.id

  //  console.log(postDetails?.id)
  //  console.log(postDetails?.id)

  const eachpostID = postDetails?._id



  return (
    <div className="flex flex-col  justify-between  rounded overflow-hidden shadow-lg m-4 ">
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2 break-words">{postDetails?.PostTitle}</h2>
        <p className="text-gray-700 text-base break-words">{postDetails?.Desc}</p>
      </div>
      <div className="flex justify-end space-x-4 p-5 pt-0">
        <button onClick={() => { inpeditPost(eachpostID) }} className="p-2 font-semibold bg-white hover:text-white text-green-600 hover:bg-green-600"><FaMarker /></button>
        <button onClick={() => { verifydelPost(eachpostID) }} className="p-2 font-semibold bg-white hover:text-white  text-red-600 hover:bg-red-600"><FaTrashCan /></button>
      </div>

    </div>

  );
};


export default Postcard;
