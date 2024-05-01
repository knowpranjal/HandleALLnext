import { useState } from 'react'

interface Icid {
    IpfsHash: string,
    handle: string
}

const ipfs = ({Handle}: any) => {
    const [textInput, setTextInput] = useState("");
    const [cid, setCid] = useState<Icid | null>();
    const [uploading, setUploading] = useState(false);
    const [handle, setHandle] = useState("");
    const [IPFS, setIPFS] = useState<Icid | null>();
  
    console.log(Handle);
  
    const handleUploadChange = () => {
      // setTextInput(e.target.value);
      setTextInput(Handle)
    };
    const handleCidChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHandle(e.target.value);
    };
  
    const uploadText = async () => {
      try {
        setUploading(true);
        const res = await fetch("/api/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: Handle }),
        });
        const resData = await res.json();
        console.log(resData);
        setCid({ ...resData });
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
      <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
        <textarea value={textInput} onChange={handleUploadChange} className="text-black" />
        <button disabled={uploading} onClick={uploadText}>
          {uploading ? "Uploading..." : "Upload Text"}
        </button>
        {cid && <p>IPFS Hash: {cid.IpfsHash}</p>}
  
  
        <textarea value={handle} onChange={handleCidChange} className="text-black"/>
        <button onClick={getCID}>
          Get CID
        </button>
        {IPFS && <p>IPFS Hash: {IPFS.IpfsHash} and handle: {IPFS.handle}</p>}
      </main>
    );
}

export default ipfs