import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sellerName: { type: String },
  sellerPhone: { type: String },
  sellerEmail: { type: String },
  sellerGSTIN: { type: String },
  sellerState: { type: String },
  sellerAddress: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
