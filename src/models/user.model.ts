import mongoose, { Schema } from "mongoose";

// user schema
// region User Schema

const usersSchema = new Schema(
  {
    firstname: { type: String, required: false, maxLength: 100 },
    lastname: { type: String, required: false, maxLength: 100 },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minLength: 7 },
    bio: { type: String, required: false },
    profilePhoto: { type: String, default: "avatar" },
    coverPhoto: { type: String, default: "cover" },
    birthdate: { type: String },
    title: { type: String },
    themeMode: { type: String, required: false, default: "lightMode" },
    colorMode: { type: String, required: false, default: "royalblue" },
    token: { type: String },
    followings_count: { type: Number, required: false, default: 0 },
    followers_count: { type: Number, required: false, default: 0 },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", usersSchema);

export default User;
