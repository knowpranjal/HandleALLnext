import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../libs/db";
import { HandleNFTModel } from "@/libs/schema";


export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    const { text } = await request.json();
    const jsonText = JSON.stringify({ text });
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: jsonText,
    });
    const { IpfsHash } = await res.json();
    console.log(IpfsHash);

    // Create a new document in the HandleNFT collection
    const newHandleNFT = new HandleNFTModel({
      ipfsHash: IpfsHash,
      Handle: text,
    });
    await newHandleNFT.save();

    return NextResponse.json({ IpfsHash, handle: text }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
