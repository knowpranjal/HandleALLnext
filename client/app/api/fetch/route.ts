import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../libs/db";
import { HandleNFTModel , type IHandleNFT } from "@/libs/schema";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract the handle from the query parameters
    const { handle } = await request.json();

    // Query the database for documents matching the handle
    const handleNFT: IHandleNFT | null = await HandleNFTModel.findOne({Handle: handle})
    console.log(handleNFT);
    // Return the result as JSON
    return NextResponse.json({ IpfsHash: handleNFT?.ipfsHash, handle: handleNFT?.Handle }, { status: 200 });
  } catch (e) {
    console.error("Error fetching data:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
