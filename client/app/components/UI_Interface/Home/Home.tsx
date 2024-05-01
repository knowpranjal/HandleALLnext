import { useState, useContext } from 'react'

import "./Home.scss";
import { handleContext } from '@/context/context';

interface Icid {
    IpfsHash: string,
    handle: string
}

const ipfs = () => {
    // const [cid, setCid] = useState<Icid | null>();
    const [uploading, setUploading] = useState(false);
    const [handle, setHandle] = useState("");
    const [IPFS, setIPFS] = useState<Icid | null>();
  
    const {cid, setCID, state, textInput, setTextInput} = useContext(handleContext);
  
    const handleUploadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextInput(e.target.value);
    };
    const handleCidChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHandle(e.target.value);
    };

    const HandleRegistration = async (event: any) => {
      event.preventDefault();
      try {
          const {contract} = state;
          const handle = textInput; 
          const ipfs = cid.IpfsHash; 
          console.log(contract);
          const transaction = await contract.registerHandle(handle, ipfs);
          transaction.wait();
          console.log(transaction);
          console.log("Handle Registered");
      } catch (error) {
          console.log(error);
      }
  }
  
    const uploadText = async () => {
      try {
        setUploading(true);
        const res = await fetch("/api/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: textInput }),
        });
        const resData = await res.json();
        console.log(resData);
        setCID({ ...resData });
        setUploading(false);
      } catch (e) {
        console.log(e);
        setUploading(false);
        alert("Trouble uploading text");
      }
    };
  
    const getCID = async () => {
      try {
        const res = await fetch("/api/fetch", {
          method: "POST",
          body: JSON.stringify({ handle }),
        });
      
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
      
        const resData = await res.json();
        setIPFS(resData);
        console.log(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
    }
  
    return (
      <main className="Home">
        <div className="Register">
            <form onSubmit={HandleRegistration}>
              <textarea value={textInput} onChange={handleUploadChange} className="text-black" />
              <div className='UploadButton'>
                  <button type='submit' disabled={uploading} >
                  {uploading ? "Uploading..." : "Upload Text"}
                  </button>
                  {/* <button onSubmit={HandleRegistration}></button> */}
              </div>
            </form>
            {cid && <p>IPFS Hash: {cid.IpfsHash}</p>}
        </div>
  
  
        <textarea value={handle} onChange={handleCidChange} className="text-black"/>
        <button onClick={getCID}>
          Get CID
        </button>
        {IPFS && <p>IPFS Hash: {IPFS.IpfsHash} and handle: {IPFS.handle}</p>}
      </main>
    );
}

export default ipfs