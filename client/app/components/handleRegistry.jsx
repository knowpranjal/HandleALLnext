import { handleContext } from '@/context/context';
import React, { useContext } from 'react'



const HandleRegister = ({state}) => {
    const {cid, setCID} = useContext(handleContext);
    const HandleRegistration = async (event) => {
        event.preventDefault();
        const {contract} = state;
        const handle = document.querySelector('#handle').value; 
        const ipfs = cid.IpfsHash; 
        const transaction = await contract.registerHandle(handle, ipfs);
        await transaction.wait();
        console.log("Handle Registered");
    }
  return (
    <>
        <form onSubmit={HandleRegistration}>
            <input id='handle' type='text' placeholder='Enter your handle'/>
            <input id='ipfs' type='text' placeholder='Enter your IPFS'/>
            <button>Register</button>
        </form>
    </>
  )
}

export default HandleRegister