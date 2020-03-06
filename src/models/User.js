import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  id: Number,
  nome: String,
  email: String
});

export default model("User", UserSchema);
