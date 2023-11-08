import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  image: {
    type: String,
  },
  apiLimit: {
    type: Number,
    default: 5
  },
});

const User = models.User || model("User", userSchema);

export default User;