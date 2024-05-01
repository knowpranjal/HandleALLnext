import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the document
interface IHandleNFT extends Document {
  ipfsHash: string;
  Handle: string;
}

// Define the schema
const HandleNFTSchema: Schema = new Schema({
  ipfsHash: { type: String, required: true },
  Handle: { type: String, required: true }
});

// Create and export the model
const HandleNFTModel = mongoose.models.HandleNFT || mongoose.model<IHandleNFT>('HandleNFT', HandleNFTSchema);

export { HandleNFTModel, type IHandleNFT };
